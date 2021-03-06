import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";

import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { QUERY_CATEGORIES } from "../../utils/queries";

function CategoryMenu() {
  // Allows the updating of global store
  const dispatch = useDispatch();
  
  // Allows the use of `categories` from global store
  const categories = useSelector((state) => state.categories.categories);

  // Variables for querying server for category data
  const { data: categoryData, loading } = useQuery(QUERY_CATEGORIES);

  // Determines where to get category data from
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });

      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  // Filters products by user click
  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
