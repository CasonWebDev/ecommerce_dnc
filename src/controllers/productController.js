import path from "path";
import { ProductService } from "../services/productService.js";
import { ImageService } from "../services/imageService.js";

import { VIEWS } from "./../config/app-config.js";

export class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.imageService = new ImageService();
    }

  async paginatedIndex(req, res) {
    try {
        const numProducts = await this.productService.getNumProducts();
        const pageSize = this.productService.pageSize;
        const totalPages = Math.ceil(numProducts / pageSize);
        const products = await this.productService.getPage(1);
        const images = await this.imageService.getAll();
        const user = req.user;
        const cart = user ? await this.productService.getUserCart(user.id) : [];
        
        res.render(
            path.resolve(VIEWS, "public", "homepage"),
            {
                title: "Homepage",
                images,
                products,
                totalPages,
                user,
                cart,
                csrfToken: req.csrfToken()
            }
        );
    } catch(e) {
        throw e;
    }
  }

  async getPageContent(req, res) {
    try {
        const products = await this.productService.getPage(req.params.page);
        const images = await this.imageService.getAll();
        const user = req.user;
        const cart = user ? await this.productService.getUserCart(user.id) : [];
        
        res.send({ products, images, cart });
    } catch(e) {
        throw e;
    }
  }

  async goToProduct(req, res) {
    try {
        const product = await this.productService.getById(req.params.id);
        const images = await this.imageService.getByProductId(req.params.id);
        const user = req.user;
        const cart = user ? await this.productService.getUserCart(user.id) : [];

        res.render(
            path.resolve(VIEWS, "public", "product", "product-details"),
            {
                title: "Product",
                product,
                images,
                user,
                cart,
                csrfToken: req.csrfToken()
            }
        );
    } catch(e) {
        res.status(404).render(path.resolve(VIEWS, "404.ejs"), {title: "Error", layout: "./public/layouts/layout-user"});
        throw e;
    }
  }

  async exibirCatalogo(req, res) {
    try {
      const catalogo = await this.productService.construirCatalogo();
      const user = req.user;
      const cart = user ? await this.productService.getUserCart(user.id) : [];

      res.render(
        path.resolve(VIEWS, "public", "catalog", "catalog"),
        {
          title: "Catálogo",
          catalogo,
          user,
          cart,
          csrfToken: req.csrfToken()
        }
      );
    } catch(e) {
      throw e;
    }
  }
}
