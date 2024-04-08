// Class for managing data sent and received from API requests
export default class AddressBookData {

    #apiURL = "https://65eca26b0ddee626c9b0bb03.mockapi.io/api/v1/contacts/";

    constructor(props) {
        // Address book. Collection of current set of working data receive since last GET request
        this.contacts = [];
    }
    
    // GET method to update the local collection
    async getContacts(fetchFromCache = true) {

        if (fetchFromCache === true && this.contacts.length > 0) {
            return this.contacts;
        }

        let collection = [];
        //const apiURL = "https://65eca26b0ddee626c9b0bb03.mockapi.io/api/v1/contacts/";

        collection = await fetch(this.#apiURL)
            .then(response => response.json())
                    
        this.contacts = collection;
        return collection;
    }

    // POST method to create new record from contact object passed into method
    async createContact(JSONObject) {

        try {
            const response = await fetch(this.#apiURL, {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(JSONObject),
            });
        
            const result = await response.json();
            await this.getContacts(false); // Update local collection after API request is made

            console.log("Success:", result);
            return result;

          } catch (error) {

            console.error("Error:", error);
          }
    }

    // PUT method for updating contact record from contact object passed into method
    async updateContact(JSONObject) {

        try {
            const id = JSONObject.id;
            const response = await fetch(this.#apiURL + `/${id}`, { // id forms last part of URL
              method: "PUT", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(JSONObject),
            });
        
            const result = await response.json();
            await this.getContacts(false); // Update local collection after API request is made

            console.log("Success:", result);
            return result;

          } catch (error) {

            console.error("Error:", error);
          }
    }

    // DELETE method by passing in record id
    async deleteContact(id) {

        try {
            const response = await fetch(this.#apiURL + `/${id}`, { // id forms last part of URL
              method: "DELETE", 
              headers: {
                "Content-Type": "application/json",
              }
            });
        
            const result = await response.json();
            await this.getContacts(false); // Update local collection after API request is made

            console.log("Success:", result);
            return result;

          } catch (error) {

            console.error("Error:", error);
          }
    }
    
}

// Export instance
export const addressBook = new AddressBookData();


