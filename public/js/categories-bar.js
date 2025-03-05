/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for initializing the category bar
 * across all of the html pages
 */

 const BASE_URL = "/";
    
 /**
  * Makes a fetch request to the API to get all of the categories,
  * then calls on createCategoryBar
  */
 async function getCategories() {
     try {
         let url = BASE_URL + "categories";
         let resp = await fetch(url);
         resp = checkStatus(resp);
         const data = await resp.json();
         createCategoryBar(data);
     } catch (err) {
         handleError(err);
     }
 }
 
 /**
  * This function creates a category bar given categories in a list
  * @param {List} data - a JSON list of categories
  */
 function createCategoryBar(data) {
     let navBar = generateCategoryBar(data);
     id("nav-category").innerHTML = "";
     id("nav-category").appendChild(navBar);
 }
 
 /**
  * This function creates a category bar given categories in a list
  * by creating a nav bar then adding items to it
  * @param {List} categories - a JSON list of categories
  */
 function generateCategoryBar(categories) {
     let list = gen("ul");
     categories.forEach(category => {
         let item = gen("li");
         item.id = category;
         let a = gen("a");
         let text = document.createTextNode(formatCategoryString(category));
         a.appendChild(text);
         a.href = "category_view.html" + "?path=" + category;
         item.appendChild(a);
         list.appendChild(item);
     })
     return list;
 }
 
 /**
  * This function makes the category string look pretty by capitalizing
  * the first word and replacing "and" with "&"
  * @param {String} string - a name of a category
  */
 function formatCategoryString(string) {
     let formattedName = "";
     const lst = string.split("-");
     lst.forEach(item => {
         if (item == "and") {
             formattedName += "& ";
         } else {
             formattedName += item.charAt(0).toUpperCase() + item.slice(1) + " ";
         }
     })
     return formattedName;
 }
 
 /**
  * This function formats the product names by capitalizing
  * the first word and replacing "-" with spaces
  * @param {String} string - a name of a category
  */
 function formatProductName(string) {
     let formattedName = "";
     const lst = string.split("-");
     lst.forEach(word => {
         let newWord = word.charAt(0).toUpperCase() + word.slice(1) + " "
         formattedName += newWord
     });
     return formattedName;
 }

 function handleError(errMsg) {
    let text = gen("h2");
    text.textContent = errMsg;
    id("nav-category").appendChild(text);
}