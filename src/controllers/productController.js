import path from "path";
import { ProductModel } from "../models/ProductModel.js";
import { ImageModel } from "../models/ImageModel.js";
const Product = new ProductModel();
const Image = new ImageModel();

import { VIEWS } from "./../config/app-config.js";

export class ProductController {
  async paginatedIndex(req, res) {
    try {
      let results = await Product.getNumProducts();
      let numProducts = results[0].numProducts;
      let pageSize = Product.pageSize;
      let totalPages = Math.ceil(numProducts / pageSize);
      let products = await Product.getPage(1);
      let images = await Image.get();
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await Product.getUserCart(user.id);
      }
      
      res.render(
        path.resolve(VIEWS, "public", "homepage"), {
          title: "Homepage",
          images: images,
          products: products,
          totalPages: totalPages,
          user: user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    } catch(e) {
      throw e;
    }
  }

  async getPageContent(req, res) {
    try {
      let products = await Product.getPage(req.params.page);
      let images = await Image.get();
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await Product.getUserCart(user.id);
      }
      res.send({
        products: products,
        images: images,
        cart: cart
      });
    } catch(e) {
      throw e;
    }
  }

  async goToProduct(req, res) {
    try {
      let product = await Product.getById(req.params.id);
      let images = await Image.getByProductId(req.params.id);
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await Product.getUserCart(user.id);
      }

      res.render(
        path.resolve(VIEWS, "public", "product", "product-details"), {
          title: "Product",
          product: product,
          images: images,
          user: user,
          cart: cart,
          csrfToken: req.csrfToken()
        }
      );
    } catch(e) {
      res.status(404).render(path.resolve(VIEWS, "404.ejs"), {title: "Error", layout: "./public/layouts/layout-user"});
      throw e;
    }
  }
}
