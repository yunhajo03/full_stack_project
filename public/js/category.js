/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for category.html - a website for trading
 * Handles populating the page with products in a category
 */

 (function() {
    "use strict";
    
    const BASE_URL = "/";

    /**
     * This function initializes the category page by initializing the category bar
     * then populating the screen with the products. It gets the category by looking
     * at the window location
     */
    function init() {
        let location = window.location.toString().split("?")[1];
        let category = location.split("=")[1];
        getCategories();
        initCategoryDisplay(category);
    }

    /**
     * Makes a fetch call to the API to get all of the products in a given category, then
     * calls a function to populate the product display.
     * @param {String} categoryName - name of category we want
     */
    async function initCategoryDisplay(categoryName) {
        try {
            let url = BASE_URL + `categories/category?category=${categoryName}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateProductView(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateProductView(productLst) {
        productLst.forEach((productInfo) => {
            let newProduct = createElem(productInfo);
            id("product-display").appendChild(newProduct);
        });
    }

    /**
     * Creates a product element to be added to home page given information
     * in JSON format. Adds images, prices, and name of the product
     * @param {Object} productInfo - product information in JSON format
     * @returns {Object} - A div object to be added to screen
     */
    function createElem(productInfo) {
        let newElm = gen("div");

        let img = gen("img");
        img.src = productInfo.imgPath;
        img.alt = productInfo.name;

        let a = gen("a");
        a.href = "product_view.html?category=" + productInfo.category + "&product=" + productInfo.name;
        a.title = productInfo.name;
        a.id = productInfo.category + "/" + productInfo.name;
        a.innerHTML = formatProductName(productInfo.name);

        let price = gen("p");
        if (productInfo.newPrice != "0") {
            let saleTag = gen("span");
            price.textContent = productInfo.newPrice;
            saleTag.textContent = "Sale";
            imgDiv.appendChild(saleTag);
            img.classList.add("prod-image");
            saleTag.classList.add("sale-tag");
        } else {
            price.textContent = productInfo.price;
        }

        newElm.appendChild(img);
        newElm.appendChild(a);
        newElm.appendChild(price);

        return newElm;
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("product-display").appendChild(text);
    }

    init();

})();