import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";

import spinner from "../assets/spinner.gif";
import Cart from "../components/Cart";
import { idbPromise } from "../utils/helpers";
import { QUERY_PRODUCTS } from "../utils/queries";
import {
  UPDATE_PRODUCTS,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
} from "../utils/actions";

function Detail() {
  // Allows for manipulation of global store
  const dispatch = useDispatch();

  // Allows the use of the global store's `products` & `cart`
  const products = useSelector((state) => state.products.products);
  const cart = useSelector((state) => state.cart.cart);

  // Pulls the id from the URL parameter
  const { id } = useParams();

  // Set the local state for current product
  const [currentProduct, setCurrentProduct] = useState({});

  // Variables for the server's query response
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      // Increment the item's quantity in the cart
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });

      // Increment the item's quantity in indexedDB
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      // Add item to the cart
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });

      // Add item to indexedDB
      idbPromise("cart", "put", { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    // Remove item from cart
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });

    // Remove item from indexedDB
    idbPromise("cart", "delete", { ...currentProduct });
  };

  // Used to get products from server, saving products to indexedDB and setting them in global state
  useEffect(() => {
    // if global store has products
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // if data is returned from query
    else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });

      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    }
    // if there is no internet connection
    else if (!loading) {
      idbPromise("products", "get").then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts,
        });
      });
    }
  }, [products, data, loading, dispatch, id]);

  // JSX for Detail page
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              onClick={removeFromCart}
              disabled={
                !cart.find((product) => product._id === currentProduct._id)
              }
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
