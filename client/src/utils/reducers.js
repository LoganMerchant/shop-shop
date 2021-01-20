import { combineReducers } from "redux";

import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";
import categoriesReducer from "../features/categories/categoriesSlice";

// Combine all of the imported/sliced reducers into one root Redux reducer function.
const rootReducer = combineReducers({
  cart: cartReducer,
  cartOpen: cartReducer,
  products: productsReducer,
  categories: categoriesReducer,
  currentCategory: categoriesReducer,
});

export default rootReducer;
