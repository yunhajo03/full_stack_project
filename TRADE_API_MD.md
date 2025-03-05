# CS132 Notes API Documentation
**Author:** Yunha Jo
**Date** 06/11/23

The Notes API support functionality for managing an ecommerce website, "Trade",
where users can sell and buy new and old products

Clients can retrieve the products in the store, their price, the sellers' location,
information about the products, and others. They can also view the categories,
products in specific categories, and promotions and sales that are avaialble.
They can also contact the admins by submitting a note and add an item they
want to sell to the store.

Summary of endpoints:
* GET /products
* GET /categories
* GET /products/product
* GET /product/review
* GET /categories/category
* POST /additem
* POST /products/product/review
* POST /messages

## *GET /products*
**Returned Data Format**: JSON list

**Description:**
Returns all of the products in the store in a list of JSON

**Parameters**
* None

**Example Request:** `/products`

**Example Response:**
```json
{
  [
      {
        "name": "iphone-13-phonecase",
        "imgPath": "img/iphone-13-phonecase.jpg",
        "price": "$8.32",
        "description": "An iphone 13 phonecase bought a week ago...",
        "location": "Los Angeles",
        "category": "accessories",
        "newPrice": "0"
      },
          {
        "name": "estee-lauder-nightly-repair-serum",
        "imgPath": "img/estee-lauder-nightly-repair-serum.jpg",
        "price": "$50.00",
        "description": "I'm selling my twice used Estee Lauder night...",
        "location": "Tustin",
        "category": "accessories",
        "newPrice": "0"
      }
    ]
}
```
## *GET /categories*
**Returned Data Format**: JSON list

**Description:**
Returns all of the categories

**Parameters**
* None

**Example Request:** `/categories`

**Example Response:**
```json
  [
      "accessories",
      "beauty",
      "clothing",
      "home-and-living",
      "promations-and-sales"
  ]
```
## *GET /products/product*
**Returned Data Format**: JSON

**Description:**
Returns a JSON about a specific product in the store

**Parameters**
* None

**Example Request:** `/products/product?category=accessories&product=iphone-13-phonecase`

**Example Response:**
```json
{
      {
        "name": "iphone-13-phonecase",
        "imgPath": "img/iphone-13-phonecase.jpg",
        "price": "$8.32",
        "description": "An iphone 13 phonecase bought a week ago...",
        "location": "Los Angeles",
        "category": "accessories",
        "newPrice": "0"
      }
}
```

## *GET /products/review*
**Returned Data Format**: text

**Description:**
Returns a text about reviews of specific product in the store

**Parameters**
* None

**Example Request:** `/products/review?category=accessories&product=iphone-13-phonecase`

**Example Response:**
```No reviews```

## *GET /categories/category*
**Returned Data Format**: JSON list

**Description:**
Returns a JSON list of all of products in a category passed in through request

**Parameters**
* None

**Example Request:** ``categories/category?category=clothing`

**Example Response:**
```json
{
      {
        "name": "black-formal-dress",
        "imgPath": "img/black-formal-dress.jpg",
        "price": "$48.79",
        "description": "A formal Jersey gown bought...",
        "location": "San Francisco",
        "category": "clothing",
        "newPrice": "0"
      }
}
```

## *POST /additem*
**Returned Data Format**: text

**Description:**
Adds a new product to the store

**Parameters**
* POST body parameters  
  * `name` (required) - name of product;
  * `price` (required) - price of product;
  * `location` (required) - location of seller;
  * `description` (required) - description of product;
  * `category` (required) - category of product;
  * `imgPath` (required) - link to image of product;

**Example Request:** `/additem`

**Example Response:**
```Item successfully added```

## *POST /products/product/review*
**Returned Data Format**: text

**Description:**
Adds a review for a product in the store

**Parameters**
* None

**Example Request:** `/products/product/review&category=accessories&product=swatch-white-whatch`

**Example Response:**
```Review successfully added```

## *POST /messages*
**Returned Data Format**: text

**Description:**
Leaves a note for the admins about the store.

**Parameters**
* POST body parameters  
  * `name` (required) - name of user;
  * `email` (required) - email of product;
  * `inquiry` (required) - what they are inquiring about;
  * `message` (required) - message from user

**Example Request:** `/messages`

**Example Response:**
```Message successfully submitted```