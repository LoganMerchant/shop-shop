import React from "react";
import { useDispatch } from "react-redux";

import { idbPromise } from "../../utils/helpers";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";

const CartItem = ({ item }) => {
  // Allows for the updating of global store.
  const dispatch = useDispatch();

  const removeFromCart = (item) => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id,
    });

    idbPromise("cart", "delete", { ...item });
  };

  // Handles user input for manipulation of cart item's purchase quantity
  const onChange = (evt) => {
    const value = evt.target.value;

    if (value === "0") {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id,
      });

      idbPromise("cart", "delete", { ...item });
    } else {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value),
      });

      idbPromise("cart", "put", {
        ...item,
        purchaseQuantity: parseInt(value),
      });
    }
  };

  // JSX
  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt="" />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity.toString()}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
