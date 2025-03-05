/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for contact.html - handles posting
 * user requests and messages to API
 */

 (function() {
  "use strict";
  
  const BASE_URL = "/";

  /**
   * This function initializes the category page by initializing the category bar
   */
  function init() {
      getCategories();
      id("contact-button").addEventListener("click", submitMessage);
  }

  /**
   * This function looks at all of the input parameters on the page,
   * creates a JSON parameter from the information, then makes
   * a POST call to API for the infomration to be added
   */
  async function submitMessage() {
      let params = {name: qs("input[name='name']").value, 
          email: qs("input[name='email']").value,
          inquiry: id("message-category").value,
          msg: id("message").value};

      try {
          let resp = await fetch(BASE_URL + "messages", { 
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
      id("contact").appendChild(text);
  }

  init();

})();