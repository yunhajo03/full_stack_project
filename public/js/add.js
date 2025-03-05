/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for additem.html - allows users to add new items to
 * the store
 */

 (function() {
  "use strict";
  
  const BASE_URL = "/";

  /**
   * This function initializes the category page by initializing the category bar
   */
  function init() {
      getCategories();
      id("add-button").addEventListener("click", addItem);
  }

  /**
   * This function looks at all of the input parameters on the page,
   * creates a JSON parameter from the information, then makes
   * a POST call to API for the infomration to be added
   */
  async function addItem() {
      let params = {name: qs("input[name='name']").value, 
          price: qs("input[name='price']").value,
          location: qs("input[name='location']").value,
          description: id("description").value,
          category: id("category").value,
          imgPath: qs("input[name='imgPath']").value};

      try {
          let resp = await fetch(BASE_URL + "additem", { 
              headers: {
                  "Content-Type": "application/json",
              },
              method : "POST",
              body : JSON.stringify(params)
          });
          resp = checkStatus(resp);
          const data = await resp.json();
          populateNotes(data);
      } catch (err) {
          handleError(err);
      }
  }

  /**
   * Displays the error message to the user
   * @param {String} errMsg - error message in string format
   */
  function handleError(errMsg) {
      let text = gen("h2");
      text.textContent = errMsg;
      id("add").appendChild(text);
  }

  init();
})();
