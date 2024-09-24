import path from "path";
import { ProductModel } from "../models/ProductModel.js";
import { ImageModel } from "../models/ImageModel.js";
import { UserModel } from "../models/UserModel.js";
const Product = new ProductModel();
const Image = new ImageModel();
const User = new UserModel();

import { VIEWS } from "./../config/app-config.js";


export class CheckoutController {
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
      cart = await Product.getUserCart(user.id);
      products = await Product.get();
      images = await Image.get();
      lastOrders = await Product.getLastOrderUser(user.id);
      ordersItems = await Product.getOrderItems();
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
      cart = await Product.getUserCart(req.user.id);
    }

    let validated = true;
    /* Validation (we could place here whatever 
      we wanted to validate for each field) */

    if(!validated){
      let error = new Error("Invalid input fields");
      res.render(
        path.resolve(VIEWS, "public", "product", "checkout-1.ejs"), {
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
      const promise = User.addShippingDetails(req.user, [address, zipCode, country, phoneNumber]);
      promise
        .then(result => {
          req.flash('success_msg', result);
          res.redirect('/checkout/2');
        })
        .catch(error => {
          res.render(
            path.resolve(VIEWS, "public", "product", "checkout-1.ejs"), {
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
    let { ccNumber, cvvNumber } = req.body;

    let cart = [];
    if (typeof(req.user) !== "undefined") {
      cart = await Product.getUserCart(req.user.id);
    }

    // Form validation
    let validated = true;

    let ccNumberCurated = ccNumber.replace(/-/g, "").replace(/ /g, "");
    let cvvNumberCurated = cvvNumber.replace(/-/g, "").replace(/ /g, "");

    let regExVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    let regExMastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
    let regExCVV = /^([0-9]{3,4})$/;

    let error;
    if (!regExCVV.test(cvvNumberCurated)){
      validated = false;
      error = new Error("Invalid CVV number");
    }
    if(!regExVisa.test(ccNumberCurated) && !regExMastercard.test(ccNumberCurated)){
      validated = false;
      error = new Error("Invalid Credit Card number");
    }

    if(!validated){
      res.render(
        path.resolve(VIEWS, "public", "product", "checkout-2.ejs"), {
          title: "Checkout",
          ccNumber: ccNumber,
          cvvNumber: cvvNumber,
          message: error,
          user: req.user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    } else {
      const promise = User.addPaymentDetails(req.user, [ccNumber, cvvNumber]);
      promise
        .then(result => {
          req.flash('success_msg', result);
          res.redirect('/checkout/3');
        })
        .catch(error => {
          res.render(
            path.resolve(VIEWS, "public", "product", "checkout-2.ejs"), {
              title: "Checkout",
              ccNumber: ccNumber,
              cvvNumber: cvvNumber,
              message: error,
              user: req.user,
              cart: cart,
              csrfToken: req.csrfToken()
            }
          );
        });
    }
  }

  async confirmOrder(req, res) {
    const { customer_id, total_order, products_stringified } = req.body;

    const products = JSON.parse(products_stringified);

    let promises = [];
    let createOrderPromise = Product.createOrder(customer_id, total_order);
    createOrderPromise
      .then(orderId => {
        products.forEach(product => {
          let promise = Product.createOrderItem(orderId, product.id, product.price, product.quantity);
          promises.push(promise);
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