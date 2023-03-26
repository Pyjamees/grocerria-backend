import express from "express"
import {getProducts, getProductsBySearchInput} from "../controllers/ProductController.js"
const router = express.Router();

router.get('/products', getProducts);

router.get('/products/:searchSortInput', getProductsBySearchInput);

export default router;