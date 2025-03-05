"use strict";

const express = require("express");
const multer = require("multer");

const app = express();
const fs = require("fs/promises");

const SERVER_ERR = 500;
const CLIENT_ERR = 400;
const SERVER_ERR_MSG = "Oops, something went wrong. Please try again";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

/**
 * Returns a list of products in the store as a JSON list
 * Returns a 500 error if something goes wrong on the server.
 */
app.get("/products", async(req, res, next) => {
    try {
        let categories = await fs.readdir("categories");
        let result = [];
        for (let i = 0; i < categories.length; i++) {            
            let productList = await getProductNames(categories[i]);
            result = result.concat(productList);
        }
        res.json(result);
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Returns a list of products in the store as a JSON list
 * @param {String} categoryPath - path to category
 */
async function getProductNames(categoryPath) {
    let itemNames = await fs.readdir(`categories/${categoryPath}`);
    let products = await getProduct(categoryPath, itemNames);
    return products;
}

/**
 * Returns a list of categories in the store as a JSON list
 * Returns a 500 error if something goes wrong on the server.
 */
app.get("/categories", async (req, res, next) => {
    try{
        let categories = await fs.readdir("categories");
        res.json(categories);
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Returns a JSON of product information given product's category
 * and product's name
 * Returns 500 if something goes wrong in the server
 */
app.get("/products/product", async (req, res, next) => {
    try{
        let category = req.query["category"].toLowerCase();
        let product = req.query["product"].toLowerCase();
        let productPath = `categories/${category}/${product}/details.txt`;
        let contents = await fs.readFile(productPath, 'utf8');
        let detailsJSON = getProductDetails(contents);
        res.json(detailsJSON);
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Returns a text of reviews of a particular product
 * when category and product is passed in as body parameters
 * Returns 500 error if something goes wrong on the server
 */
app.get("/product/review", async (req, res, next) => {
    try{
        let category = req.query["category"].toLowerCase();
        let product = req.query["product"].toLowerCase();
        let productPath = `categories/${category}/${product}/reviews.txt`;
        let contents = await fs.readFile(productPath, 'utf8');
        res.type("text");
        res.send(contents);
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Returns a JSON list of items in a specific category given
 * category name in the query
 * Returns 500 error if there is an error in the server
 */
app.get("/categories/category", async (req, res, next) => {
    let categoryPath = req.query["category"].toLowerCase();
    console.log(categoryPath);
    try {
        let itemNames = await fs.readdir(`categories/${categoryPath}`);
        let prodLst = await getProduct(categoryPath, itemNames);
        res.json(prodLst);
    } catch (err) { 
        if (err.code === "ENOENT") {
            res.status(CLIENT_ERR);
            err.message = "Category " + req.params.category + " not found.";
        } else {
            res.status(SERVER_ERR);
            err.message = SERVER_ERR_MSG;
        }
        next(err); 
    }
});

/**
 * Adds an item to the list of products in the store and sends
 * a success message
 * Returns client error if params are missing
 * Returns 500 if something goes wrong in the server
 */
app.post("/additem", async (req, res, next) => {
    console.log("inside add time");
    let body = req.body;
    const name = body.name;
    const price = body.price;
    const location = body.location;
    const description = body.description;
    const category = body.category;
    const imgPath = body.imgPathl

    let pathName = "categories/" + category + "/" + name;
    let fileName = pathName + "/" + "details.txt";
    let reviewFile = pathName + "/" + "reviews.txt";
    let fileContents = processAddItemArgs(name, price, location, description, category, imgPath);

    if (!fileContents) {
        res.status(CLIENT_ERR);
        next(Error("Please fill in all of the required information."));
    }

    try {
        await fs.readFile(fileName, "utf8");  
    } catch(err) {
        if (err.code !== "ENOENT") {
            res.status(SERVER_ERR);
            err.message = SERVER_ERR_MSG;
            next(err);
        }
    }
    try {
        await fs.mkdir(pathName);
        await fs.writeFile(fileName, fileContents, "utf8");
        await fs.writeFile(reviewFile, "", "utf8");
        res.send("Item successfully added! Please contact us if you have any questions.");
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Adds a review to a review of products, given category and name of
 * the product in the query
 * Returns 500 if something goes wrong in the server
 */
app.post("/products/product/review", async (req, res, next) => {
    try{
        let category = req.query["category"].toLowerCase();
        let product = req.query["product"].toLowerCase();
        let productPath = `categories/${category}/${product}/reviews.txt`;
        let exReviews = await fs.readFile(productPath, 'utf8');
        let newReviews = exReviews + "+" + res.body.contents;
        await fs.writeFile(productPath, newReviews, 'utf8');
        res.send("Review successfully posted!");
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Adds a message from a user to the message file for Admin to view
 * Returns client error if params are missing
 * Returns server error if something goes wrong in the server
 */
app.post("/messages", async (req, res, next) => {
    let newMsg = processMessageArgs(req.body.name, req.body.email, req.body.inquiry, req.body.msg);

    if (!newMsg) {
        res.status(CLIENT_ERR);
        next(Error("Please fill in all of the required information."));
    }

    try {
        let exMessages = await fs.readFile("customer_messages.json", "utf8");
        console.log(exMessages);
        let messages = JSON.parse(exMessages);
        messages.push(newMsg);
        await fs.writeFile("customer_messages.json", JSON.stringify(messages), "utf8");
        res.type("text");
        res.send("Message successfully submitted!");
    } catch(err) {
        res.status(SERVER_ERR);
        err.message = SERVER_ERR_MSG;
        next(err);
    }
});

/**
 * Gets all of the products in a specific category and returns it
 * as a JSON list
 * @param {String} categoryPath - string of category name
 * @param {List[String]} itemNames - names of products in a given category
 * @return a list of JSONs
 */
async function getProduct(categoryPath, itemNames) {
    let productList = [];
    for (let i = 0; i < itemNames.length; i++) {
        let productName = itemNames[i];
        let productPath = "categories/" + categoryPath + "/" + productName + "/" + "details.txt";
        let detailsJSON = await getProductHelper(productPath);
        productList.push(detailsJSON);
    }
    return productList;
}

/**
 * Helper function for getProduct - reads product File then creates a JSON object
 * @param {String} productPath - string of product name
 * @return JSON of product information
 */
async function getProductHelper(productPath) {
    let contents = await fs.readFile(productPath, 'utf8');
    let detailsJSON = getProductDetails(contents);
    return detailsJSON;
}

/**
 * Returns a JSON object about a product given contents of file
 * @return JSON object of product information
 */
function getProductDetails(contents) {
    let lines = contents.split("\n");
    let response = 
        {
            name: lines[0],
            imgPath: lines[1],
            price: lines[2],
            description: lines[4],
            location: lines[3],
            category: lines[5],
            newPrice: lines[6]
        }
    return response;
}

/**
 * Checks if all of the arguments for adding an item are present and
 * returns a string formatted item to be wrote to a file
 * @param name - name of product
 * @param price - price of product
  * @param location - location of seller
  * @param description - description of product
  * @param category - category of product
  * @param imgPath - link to image of product
 * @return string of item informaiton
 */
function processAddItemArgs(name, price, location, description, category, imgPath) {
    let itemContents = null;
    if (name && price && location && description && category && imgPath) {
        itemContents = name + "\n" + imgPath + "\n" + price + "\n" + description + "\n" + location + "\n" + category + "\n" + "0\n";
    }
    return itemContents;
}

/**
 * Checks if all of the arguments for adding a message are present and
 * returns a JSON formatted item to be wrote to a file
  * @param name - name of user;
  * @param email - email of product;
  * @param inquiry - what they are inquiring about;
  * @param message - message from user
 * @return string of item informaiton
 */

function processMessageArgs(name, email, inquiry, msg) {    
    let newMsg = null;
    if (name && email && inquiry && msg) {
        newMsg = {
            "name": name,
            "email": email,
            "inquiry": inquiry,
            "message": msg
        }
    }
    return newMsg;
}

/**
 * A middleware function for handling error
 */
function handleError(err, req, res, next) {
    res.type("text");
    res.send(err.message);
}

app.use(handleError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});