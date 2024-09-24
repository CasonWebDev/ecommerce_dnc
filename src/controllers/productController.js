import path from "path";
import { ProductRepository } from "../repositories/productRepository.js";
import { ImageRepository } from "../repositories/imageRepository.js";

import { VIEWS } from "./../config/app-config.js";

export class ProductController {
    constructor() {
        this.productRepository = new ProductRepository();
        this.imageRepository = new ImageRepository();
    }

  async paginatedIndex(req, res) {
    try {
      let results = await this.productRepository.getNumProducts();
      let numProducts = results[0].numProducts;
      let pageSize = this.productRepository.pageSize;
      let totalPages = Math.ceil(numProducts / pageSize);
      let products = await this.productRepository.getPage(1);
      let images = await this.imageRepository.get();
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await this.productRepository.getUserCart(user.id);
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
      let products = await this.productRepository.getPage(req.params.page);
      let images = await this.imageRepository.get();
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await this.productRepository.getUserCart(user.id);
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
      let product = await this.productRepository.getById(req.params.id);
      let images = await this.imageRepository.getByProductId(req.params.id);
      let user = req.user;
      let cart = [];
      if (typeof(user) !== "undefined") {
        cart = await this.productRepository.getUserCart(user.id);
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
