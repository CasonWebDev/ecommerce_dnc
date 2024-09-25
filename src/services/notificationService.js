import { Observer } from '../utils/observer.js';

class EmailNotification extends Observer {
  update(data) {
    console.log(`Enviando e-mail: ${data.message}`);
    // Implementar lógica de envio de e-mail aqui
  }
}

class SMSNotification extends Observer {
  update(data) {
    console.log(`Enviando SMS: ${data.message}`);
    // Implementar lógica de envio de SMS aqui
  }
}

export { EmailNotification, SMSNotification };