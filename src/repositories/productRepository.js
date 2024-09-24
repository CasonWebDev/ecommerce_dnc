import { ProductModel } from "../models/ProductModel.js";

export class ProductRepository {
  constructor() {
    this.model = new ProductModel();
  }

  async getNumProducts() {
    const results = await this.model.getNumProducts();
    return results[0].numProducts;
  }

  async getPage(page) {
    return this.model.getPage(page);
  }

  async getById(id) {
    return this.model.getById(id);
  }

  async getUserCart(userId) {
    return this.model.getUserCart(userId);
  }
}