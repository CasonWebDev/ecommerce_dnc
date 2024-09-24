import { ImageRepository } from "../repositories/imageRepository.js";

export class ImageService {
    constructor() {
        this.imageRepository = new ImageRepository();
    }

    async getAll() {
        return this.imageRepository.get();
    }

    async getByProductId(productId) {
        return this.imageRepository.getByProductId(productId);
    }
}