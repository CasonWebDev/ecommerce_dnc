export class CatalogComponent {
    constructor(nome) {
      this.nome = nome;
    }
  
    getPreco() {
      throw new Error("Método getPreco deve ser implementado");
    }
  
    exibir() {
      throw new Error("Método exibir deve ser implementado");
    }
  }
  
  export class Produto extends CatalogComponent {
    constructor(nome, preco, id) {
      super(nome);
      this.preco = preco;
      this.id = id;
    }
  
    getPreco() {
      return this.preco;
    }
  
    exibir() {
      console.log(`Produto: ${this.nome} - Preço: R$${this.preco}`);
    }
  }
  
  export class Categoria extends CatalogComponent {
    constructor(nome, id) {
      super(nome);
      this.id = id;
      this.filhos = [];
    }
  
    adicionar(componente) {
      this.filhos.push(componente);
    }
  
    remover(componente) {
      const index = this.filhos.indexOf(componente);
      if (index !== -1) {
        this.filhos.splice(index, 1);
      }
    }
  
    getPreco() {
      return this.filhos.reduce((total, filho) => total + filho.getPreco(), 0);
    }
  
    exibir() {
      console.log(`Categoria: ${this.nome}`);
      this.filhos.forEach(filho => filho.exibir());
    }
  }