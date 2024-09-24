import { ProductRepository } from "../repositories/productRepository.js";

export class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getNumProducts() {
        const results = await this.productRepository.getNumProducts();
        return results[0].numProducts;
    }

    async getPage(page) {
        return this.productRepository.getPage(page);
    }

    async getById(id) {
        return this.productRepository.getById(id);
    }

    async getUserCart(userId) {
        return this.productRepository.getUserCart(userId);
    }

    get pageSize() {
        return this.productRepository.pageSize;
    }

    async getCategorias() {
        return this.productRepository.getCategorias();
    }

    async getProdutosPorCategoria(categoriaId) {
        return this.productRepository.getProdutosPorCategoria(categoriaId);
    }

    async construirCatalogo() {
        return this.productRepository.construirCatalogo();
    }
}