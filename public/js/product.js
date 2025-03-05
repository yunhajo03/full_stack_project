/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for product.html - a website for Trading
 * Handles displaying a specific product on the page
 */

 (function() {
    "use strict";
  
    const BASE_URL = "/";
    let CATEGORY;
    let PRODUCT;

    /**
   * This function initializes the home page by initializing the category bar
   * then populating the screen with information about the product
   * It also sets global variables for category and product
   */
    function init() {
        let location = window.location.toString().split("?")[1];
        let category = location.split("&")[0].split("=")[1];
        let product = location.split("&")[1].split("=")[1];
        CATEGORY = category;
        PRODUCT = product;
        id("submit-review").addEventListener("click", postReview);
        getCategories();
        initProductPageDisplay(category, product);
        getReviews();
    }

    /**
   * Makes a fetch call to the API to get information about a product,
   * given the category and name. The calls functions to populate the
   * product page
   * @param {String} category - string for category
   * @param {String} productId - name of the product
   */
    async function initProductPageDisplay(category, productId) {
        try {
            let url = BASE_URL + `products/product?category=${category}&product=${productId}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            productPage(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
   * Creates a product detail information page given information
   * in JSON format. Adds images, prices, and name of the product, as well
   * as others
   * @param {Object} productInfo - product information in JSON format
   */
    function productPage(productData) {

        id("product-details").innerHTML = "";

        let img = gen("img");
        img.src = productData.imgPath;
        img.alt = productData.name;

        let details = gen("div");

        let name = gen("h2");
        let price = gen("h3");
        let category = gen("h4")
        let description = gen("p");
        let location = gen("h4");

        name.textContent = formatProductName(productData.name);
        category.textContent = formatCategoryString(productData.category);
        description.textContent = productData.description;
        location.textContent = productData.location;
        price.textContent = productData.price;

        details.appendChild(name);
        details.appendChild(price);

        if (productData.newPrice != 0) {
            let newPrice = gen("h3");
            newPrice.textContent = productData.newPrice;
            price.classList.add("discount");
            details.appendChild(newPrice);
        }

        details.appendChild(category);
        details.appendChild(description);
        details.appendChild(location);

        id("product-figure").appendChild(img);
        id("product-details").appendChild(details);
        id("cart").addEventListener("click", addToCart);
    }

    /**
   * Adds the current item to the cart by making a POST fetch call to API
   * then adding the item information to cart list
   */
    async function addToCart() {
        try {
            let url = BASE_URL + `products/product?category=${CATEGORY}&product=${PRODUCT}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            newItem(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
   * Adds the current item to the cart items, a cart saved on local
   * storage
   * @param {Object} productData - product information in JSON format
   */
    function newItem(productData) {
        let cartList = [];

        if(localStorage.getItem('cart-items')){
            cartList = JSON.parse(localStorage.getItem('cart-items'));
        }

        let newItem = {
            'name': formatProductName(productData.name),
            'price': productData.price,
            'location': productData.location,
            'imgPath': productData.imgPath
        }

        cartList.push(newItem);
        localStorage.setItem('cart-items', JSON.stringify(cartList));
        id("message-area").textContent = "Item added to cart!";
    }

    /**
   * Posts a review to the page by making a POST request to API.
   */
    async function postReview() {
        let review = id("review-text").value;
        try {
            let url = BASE_URL + `products/product/review?category=${CATEGORY}&product=${PRODUCT}`;
            let resp = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : review});
            resp = checkStatus(resp);
        } catch (err) {
            handleError(err);
        }
    }

    /**
   * Gets reviews about the current product then populates the reviews section
   */
    async function getReviews() {
        try {
            let url = BASE_URL + `product/review?category=${CATEGORY}&product=${PRODUCT}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            resp = await resp.text();
            createReviews(resp);
        } catch (err) {
            handleError(err);
        }
    }

    /**
   * Creates and appends reviews given review as a text format
   * @param {Text} reviewText - a review about the product
   */
    function createReviews(reviewText) {
        let reviews = reviewText.split("+");
        reviews.forEach((review) => {
            let reviewBox = gen("div");
            let text = gen("p");
            reviewBox.appendChild(text);
            text.textContent = review;
            id("reviews-submitted").appendChild(reviewBox);
        });
    }

    /**
   * Displays the error message to the user
   * @param {String} errMsg - error message in string format
   */
    function handleError(errMsg) {
        id("message-area").textContent = errMsg;
    }

    init();

})();