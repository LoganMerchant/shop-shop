import { createStore } from "redux";
import rootReducer from "./reducers";

// Creates Redux global store
const store = createStore(rootReducer);

export default store;
