import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";

import "./style.css";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { QUERY_CHECKOUT } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = () => {
  // Allows editing of global store
  const dispatch = useDispatch();

  // Allows the use of `cart` and `cartOpen` from global store
  const globalCart = useSelector((state) => state.cart.cart);
  const globalCartOpen = useSelector((state) => state.cartOpen.cartOpen);

  // Allows the delayed query for checkout
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  // Check to see if there are saved items in indexedDB
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");

      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    if (!globalCart.length) {
      getCart();
    }
  }, [globalCart.length, dispatch]);

  // If the checkout query is fired by user, create Stripe checkout session
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  // Get the cost for the items in the cart
  function calculateTotal() {
    let sum = 0;

    globalCart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });

    if (!sum) {
      return "0.00";
    } else {
      return sum.toFixed(2);
    }
  }

  // Event listener for checkout that will fire off `getCheckout`
  function submitCheckout() {
    const productIds = [];

    globalCart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  // JSX
  if (!globalCartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="cart">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {globalCart.length ? (
        <div>
          {globalCart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
