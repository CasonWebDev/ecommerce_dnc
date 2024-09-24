import path from "path";
import { ProductModel } from "../models/ProductModel.js";
import { ImageModel } from "../models/ImageModel.js";
const Product = new ProductModel();
const Image = new ImageModel();

import { VIEWS } from "./../config/app-config.js";

export class CartController {
  async goToCart(req, res) {
    let user = req.user;
    let cart = [];
    let products = [];
    let images = [];
    if (typeof(user) !== "undefined") {
      cart = await Product.getUserCart(user.id);
      products = await Product.get();
      images = await Image.get();
    }

    res.render(
      path.resolve(VIEWS, "public", "product", "cart.ejs"), {
        title: "Shopping cart",
        user: user,
        cart: cart,
        products: products,
        images: images,
        csrfToken: req.csrfToken()
      }
    );
  }

  async addToCart(req, res) {
    try {
      const { customer_id, product_id } = req.body;
      let resultStock = await Product.updateStock(product_id, -1);
      let resultCart = await Product.createInCart(customer_id, product_id);
      res.send({
        messageStock: resultStock,
        messageCart: resultCart
      });
    } catch(e) {
      res.send({
        message: e.message
      });
      throw e;
    }
  }

  async removeFromCart(req, res) {
    try {
      const { customer_id, product_id } = req.body;
      let cartItems = await Product.getCartItem(customer_id, product_id);
      let resultStock = await Product.updateStock(product_id, cartItems[0].quantity);
      let resultCart = await Product.deleteInCart(customer_id, product_id);
      res.send({
        messageStock: resultStock,
        messageCart: resultCart
      });
    } catch(e) {
      res.send({
        message: e.message
      });
      throw e;
    }
  }

  async updateCart(req, res) {
    try {
      const { customer_id, product_id, new_quantity } = req.body;
      let cartItems = await Product.getCartItem(customer_id, product_id);
      let difference = cartItems[0].quantity - new_quantity;
      let resultStock = await Product.updateStock(product_id, difference);
      let resultCart = await Product.updateInCart(customer_id, product_id, new_quantity);

      res.send({
        messageStock: resultStock,
        messageCart: resultCart
      });
    } catch(e) {
      res.send({
        message: e.message
      });
      throw e;
    }
  }
}
