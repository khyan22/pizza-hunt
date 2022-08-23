//var holds the connection to idb
let db;
//establishes a connection to browsers idb and creates a db called 'pizza_hunt' and set to version 1
//this also acts as an event listener
const request = indexedDB.open('pizza_hunt', 2);

//this event will trigger on db version change
request.onupgradeneeded = function(event) {
  //saves reference to db
  const db = event.target.result;
  //create an object store(table) called 'new_pizza', set to auto increment the primary key
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function(event) {
  // when db is created above or connected to db, reference to db is stored in global variable
  db = event.target.result;

  //checks if app is online
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(event) {
  //logs error
  console.log(event.target.errorCode);
};

//executes when new pizza attempt is made but connection is lost
function saveRecord(record) {
  //opens new transaction(connection) with db with read/write permissions
  const transaction = db.transaction('new_pizza', 'readwrite');

  //accesses the 'new_pizza' idb 
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  //uses the var above to add the new "record"(data) to it
  pizzaObjectStore.add(record);
};

function uploadPizza() {
  const transaction = db.transaction('new_pizza', 'readwrite');

  const pizzaObjectStore = transaction.objectStore('new_pizza');

  //hold all pizza made while offline 
  const getAll = pizzaObjectStore.getAll();

  //upon successful .getAll execution, run this function
  getAll.onsuccess = function() {
    //if there was data in idb's objects store it will send it to api server
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(serverResponse => {
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }

        const transaction = db.transaction('new_pizza', 'readwrite');

        const pizzaObjectStore = transaction.objectStore('new_pizza');

        //clears all data in object store 
        pizzaObjectStore.clear();

        alert('All saved pizzas have been submitted.');
      })
      .catch(err => {
        console.log(err);
      })
    }
  };
};

//listen app to come back online
window.addEventListener('online', uploadPizza);