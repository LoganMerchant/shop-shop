export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the db `shop-shop` with the version of 1
    const request = window.indexedDB.open("shop-shop", 1);

    // create variables to hold reference to the db, transaction(tx), and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the db)...
    // run this method and create the three object stores
    request.onupgradeneeded = function (evt) {
      const db = request.result;

      // create object store for each type of data...
      // and set 'primary' key index to be the `_id` of the data
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });

      // handle any errors with connecting
      request.onerror = function (evt) {
        console.log("There was an error...");
      };
    };

    // on db open success
    request.onsuccess = function (evt) {
      // save a reference of the db to the `db` variable
      db = request.result;
      // open a transaction to whatever we pass into `storeName`
      tx = db.transaction(storeName, "readwrite");
      // save a reference to that object store
      store = tx.objectStore(storeName);

      // if errors occur...
      db.onerror = function (evt) {
        console.log("error", evt);
      };

      // perfom CRUD methods on data
      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }

      // when the trasnaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
