import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";

const initialState = {
  categories: [],
  currentCategory: "",
};

// Reducer functions for categories
export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };
    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };
    default:
      return state;
  }
}
