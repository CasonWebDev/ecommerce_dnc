import { ImageModel } from "../models/ImageModel.js";

export class ImageRepository {
  constructor() {
    this.model = new ImageModel();
  }

  async get() {
    return this.model.get();
  }

  async getByProductId(productId) {
    return this.model.getByProductId(productId);
  }
}