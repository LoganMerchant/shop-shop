import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";

import ProductItem from "../ProductItem";
import { idbPromise } from "../../utils/helpers";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";
import { UPDATE_PRODUCTS } from "../../utils/actions";

function ProductList() {
  // Allows the updating of global store
  const dispatch = useDispatch();

  // Allows the use of global store's `currentCategory` & `products`
  const products = useSelector((state) => state.products.products);
  const currentCategory = useSelector(
    (state) => state.currentCategory.currentCategory
  );

  // Queries server for product data
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // Determine where to get product data from
  useEffect(() => {
    if (data) {
      // store the products in global state
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });

      // store the products in indexedDB
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    } else if (!loading) {
      // store products from indexedDB to global state
      idbPromise("products", "get").then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  // Filters products based on `currentCategory`
  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  // JSX
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
