import { UPDATE_PRODUCTS } from "../../utils/actions";

const initialState = {
  products: [],
};

// Reducer function for products
export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    default:
      return state;
  }
}
