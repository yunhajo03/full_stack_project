/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for category.html - a website for trading
 * Handles populating the page with products in a category
 */

 (function() {
    "use strict";

    /**
     * This function initializes the category page by initializing the category bar
     * then populating the screen with the products added to the cart
     */
    function init() {
        getCategories();
        populateCartItems();
    }

    /**
     * Populates the screen with items in the cart by looking at the local storage
     * then calling createProductItem on each of the items in the cart
     */
    function populateCartItems() {
        let products;
        if (localStorage.getItem("cart-items") != []) {
            id("cart-items").innerHTML = "";
            products = JSON.parse(localStorage.getItem("cart-items"));
            products.forEach((product) => {
                let item = createProductItem(product);
                id("cart-items").appendChild(item);
            });
        } else {
            let emptyMsg = gen("h2");
            emptyMsg.textContent = "No items in cart";
            id("cart-items").appendChild(emptyMsg);
        }
    }

    /**
     * Creates a div object given information about product,
     * including image, name, location, and price
     * @param product - product information given in JSON format
     */
    function createProductItem(product) {
        let item = gen("div");
        let img = gen("img");
        let name = gen("h2");
        let price = gen("h3");
        let location = gen("p");

        name.textContent = product.name;
        price.textContent = product.price;
        location.textContent = product.location;
        img.src = product.imgPath;
        img.alt = "picture of " + product.name;

        item.appendChild(name);
        item.appendChild(img);
        item.appendChild(price);
        item.appendChild(location);

        return item;
    }

    init();

})();