import path from "path";

import { Subject } from '../utils/observer.js';
import { EmailNotification, SMSNotification } from '../services/notificationService.js';

class Validator {
    validate(value) {
        throw new Error("Method 'validate()' must be implemented.");
    }

    getErrorMessage() {
        throw new Error("Method 'getErrorMessage()' must be implemented.");
    }
}

class CVVValidator extends Validator {
    validate(value) {
        const regExCVV = /^([0-9]{3,4})$/;
        return regExCVV.test(value);
    }

    getErrorMessage() {
        return "Invalid CVV number";
    }
}

class CreditCardValidator extends Validator {
    validate(value) {
        const regExVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const regExMastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
        return regExVisa.test(value) || regExMastercard.test(value);
    }

    getErrorMessage() {
        return "Invalid Credit Card number";
    }
}

class ValidatorFactory {
    static createValidator(type) {
      switch (type) {
        case 'cvv':
          return new CVVValidator();
        case 'creditCard':
          return new CreditCardValidator();
        default:
          throw new Error('Tipo de validador inválido');
      }
    }
  }

class AddressValidator extends Validator {
    validate(value) {
        // Implementar a lógica de validação do endereço
        return value && value.length > 0;
    }

    getErrorMessage() {
        return "Invalid address";
    }
}

class ZipCodeValidator extends Validator {
    validate(value) {
        // Implementar a lógica de validação do código postal
        const regExZipCode = /^[0-9]{5}(?:-[0-9]{4})?$/;
        return regExZipCode.test(value);
    }

    getErrorMessage() {
        return "Invalid zip code";
    }
}

class CountryValidator extends Validator {
    validate(value) {
        // Implementar a lógica de validação do país
        return value && value.length > 0;
    }

    getErrorMessage() {
        return "Invalid country";
    }
}

class PhoneNumberValidator extends Validator {
    validate(value) {
        // Implementar a lógica de validação do número de telefone
        const regExPhone = /^\+?[1-9]\d{1,14}$/;
        return regExPhone.test(value);
    }

    getErrorMessage() {
        return "Invalid phone number";
    }
}

// Interface para métodos de pagamento
class PaymentMethod {
    validate(paymentDetails) {
        throw new Error("Método 'validate()' deve ser implementado.");
    }

    process(paymentDetails) {
        throw new Error("Método 'process()' deve ser implementado.");
    }
}

// Adaptador para cartão de crédito
class CreditCardAdapter extends PaymentMethod {
    constructor() {
        super();
        this.ccValidator = new CreditCardValidator();
        this.cvvValidator = new CVVValidator();
    }

    validate(paymentDetails) {
        const { ccNumber, cvvNumber } = paymentDetails;
        return this.ccValidator.validate(ccNumber) && this.cvvValidator.validate(cvvNumber);
    }

    process(paymentDetails) {
        // Lógica para processar pagamento com cartão de crédito
        console.log("Processando pagamento com cartão de crédito");
    }
}

// Adaptador para PayPal (exemplo)
class PayPalAdapter extends PaymentMethod {
    validate(paymentDetails) {
        // Lógica de validação para PayPal
        return true; // Simplificado para este exemplo
    }

    process(paymentDetails) {
        // Lógica para processar pagamento com PayPal
        console.log("Processando pagamento com PayPal");
    }
}

export class CheckoutController extends Subject {
    constructor(productModel, imageModel, userModel, views) {
        this.Product = productModel;
        this.Image = imageModel;
        this.User = userModel;
        this.VIEWS = views;

        this.paymentMethods = {
            creditCard: new CreditCardAdapter(),
            paypal: new PayPalAdapter()
        };

        this.addObserver(new EmailNotification());
        this.addObserver(new SMSNotification());
    }

  async goToCheckout(req, res) {
    let step = req.params.step;
    let checkoutView = "checkout-" + step + ".ejs";

    let user = req.user;
    let cart = [];
    let products = [];
    let images = [];
    let lastOrders = [];
    let ordersItems = [];
    if (typeof(user) !== "undefined") {
      cart = await this.Product.getUserCart(user.id);
      products = await this.Product.get();
      images = await this.Image.get();
      lastOrders = await this.Product.getLastOrderUser(user.id);
      ordersItems = await this.Product.getOrderItems();
    }

    res.render(
      path.resolve(VIEWS, "public", "product", checkoutView), {
        title: "Checkout",
        user: user,
        cart: cart,
        products: products,
        images: images,
        lastOrders: lastOrders,
        ordersItems: ordersItems,
        csrfToken: req.csrfToken()
      }
    );
  }

  async validateShipping(req, res) {
    const { address, zipCode, country, phoneNumber } = req.body;

    let cart = [];
    if (typeof(req.user) !== "undefined") {
      cart = await this.Product.getUserCart(req.user.id);
    }

    let validators = [
        { field: 'address', validator: new AddressValidator() },
        { field: 'zipCode', validator: new ZipCodeValidator() },
        { field: 'country', validator: new CountryValidator() },
        { field: 'phoneNumber', validator: new PhoneNumberValidator() }
    ];
  
    let validated = true;
    let error;
    let invalidField;
  
    for (let { field, validator } of validators) {
        if (!validator.validate(req.body[field])) {
            validated = false;
            error = new Error(validator.getErrorMessage());
            invalidField = field;
            break;
        }
    }

    if(!validated){
      let error = new Error("Invalid input fields");
      res.render(
        path.resolve(this.VIEWS, "public", "product", "checkout-1.ejs"), {
          title: "Checkout",
          address: address,
          zipCode: zipCode,
          country: country,
          phoneNumber: phoneNumber,
          message: error,
          user: req.user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    } else {
      const promise = this.User.addShippingDetails(req.user, [address, zipCode, country, phoneNumber]);
      promise
        .then(result => {
          req.flash('success_msg', result);
          res.redirect('/checkout/2');
        })
        .catch(error => {
          res.render(
            path.resolve(this.VIEWS, "public", "product", "checkout-1.ejs"), {
              title: "Checkout",
              address: address,
              zipCode: zipCode,
              country: country,
              phoneNumber: phoneNumber,
              user: req.user,
              cart: cart,
              message: error,
              csrfToken: req.csrfToken()
            }
          );
        });
    }
  }

  async validatePayment(req, res) {
    const { paymentMethod, ...paymentDetails } = req.body;

    let cart = [];
    if (typeof(req.user) !== "undefined") {
      cart = await this.Product.getUserCart(req.user.id);
    }

    const selectedPaymentMethod = this.paymentMethods[paymentMethod];

    if (!selectedPaymentMethod) {
      return res.render(
        path.resolve(this.VIEWS, "public", "product", "checkout-2.ejs"),
        {
          title: "Checkout",
          message: new Error("Método de pagamento inválido"),
          user: req.user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    }

    if (!selectedPaymentMethod.validate(paymentDetails)) {
      return res.render(
        path.resolve(this.VIEWS, "public", "product", "checkout-2.ejs"),
        {
          title: "Checkout",
          message: new Error("Detalhes de pagamento inválidos"),
          user: req.user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    }

    try {
      await selectedPaymentMethod.process(paymentDetails);
      await this.User.addPaymentDetails(req.user, paymentDetails);
      req.flash('success_msg', 'Detalhes de pagamento adicionados com sucesso');
      res.redirect('/checkout/3');
    } catch (error) {
      res.render(
        path.resolve(this.VIEWS, "public", "product", "checkout-2.ejs"),
        {
          title: "Checkout",
          message: error,
          user: req.user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    }
  }

  async confirmOrder(req, res) {
    const { customer_id, total_order, products_stringified } = req.body;

    const products = JSON.parse(products_stringified);

    let promises = [];
    let createOrderPromise = this.Product.createOrder(customer_id, total_order);
    createOrderPromise
      .then(orderId => {
        products.forEach(product => {
          let promise = Product.createOrderItem(orderId, product.id, product.price, product.quantity);
          promises.push(promise);
        });

        // Notificar observadores
        this.notifyObservers({
            message: `Novo pedido criado: ID ${orderId}, Total: ${total_order}`
        });
      })
      .catch(e => {
        res.send(e.message);
      });

    Promise.all(promises)
      .then(() => {
        return Product.deleteUserCart(customer_id);
      })
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.send(error.message);
      });
  }
}