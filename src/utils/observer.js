class Subject {
    constructor() {
      this.observers = [];
    }
  
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    removeObserver(observer) {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    }
  
    notifyObservers(data) {
      this.observers.forEach(observer => observer.update(data));
    }
  }
  
  class Observer {
    update(data) {
      throw new Error("Método 'update()' deve ser implementado.");
    }
  }
  
  export { Subject, Observer };