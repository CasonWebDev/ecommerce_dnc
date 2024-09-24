import express from "express";
import csrf from "csurf";
const csrfProtection = csrf({cookie: true});

const router = express.Router();
router.use(csrfProtection);

import { ProductController } from "./../controllers/ProductController.js";
import { CartController } from "./../controllers/CartController.js";
import { CheckoutController } from "./../controllers/CheckoutController.js";
const productController = new ProductController();
const cartController = new CartController();
const checkoutController = new CheckoutController();

import { AuthUtil } from "../config/auth.js";
const Auth = new AuthUtil();

router.get("/", productController.paginatedIndex);
router.get("/products/:page", productController.getPageContent);
router.get("/product/:id", productController.goToProduct);
router.get("/cart", Auth.ensureAuthenticated, cartController.goToCart);
router.post("/cart/addToCart", Auth.ensureAuthenticated, cartController.addToCart);
router.post("/cart/removeFromCart", Auth.ensureAuthenticated, cartController.removeFromCart);
router.post("/cart/updateCart", Auth.ensureAuthenticated, cartController.updateCart);
router.get("/checkout/:step", Auth.ensureAuthenticated, checkoutController.goToCheckout);
router.post("/checkout/1", Auth.ensureAuthenticated, checkoutController.validateShipping);
router.post("/checkout/2", Auth.ensureAuthenticated, checkoutController.validatePayment);
router.post("/checkout/3", Auth.ensureAuthenticated, checkoutController.confirmOrder);

export { router };