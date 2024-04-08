import './App.css';
import { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar'
import ContactForm from './components/ContactForm';
import Contacts from './components/Contacts';
import ContactCard from './components/ContactCard';
import { addressBook } from './appdata/AddressBookData';


function App() {

  let [isEditMode, setFormEditMode] = useState(false) // State var/method to indicate form mode
  let [contacts, setContacts] = useState(null) // State var/method for holding records

  // Determines rendering of upper half of app. Object is used to indicate whether to render a form or a contact card
  let [viewMode, setViewMode] = useState({
    showContactCard: false,
    contact: null
  })

  // To run initially on first render when no records are present
  useEffect(() => {
    if (contacts === null) {
      const getData = async () => {
        await getContacts()
      }
      getData();
    } 
  }, [])

  // Function to get latest collection and store in state
  async function getContacts() {
    const response = await addressBook.getContacts(false) 
    setContacts(await response);
  }

  // Used to detemine whether form is for creating new record or updating existing record
  function formEntryMode() {
    return (isEditMode) ? 'EditContact' : 'NewContact';
  }

  // Object with method to indicate whether to render a contact card or entry form. This is a callback method to be passed into components
  let propsObj = {
    showContactCard: (contactObj) => {
      setViewMode(contactObj);

      if (contactObj.contact !== null) {
        setFormEditMode(true);
      } else {
        setFormEditMode(false)
      }
    }
  }

  // Function to update data in this component's state
  function updateContacts() {
    let updateData = async () => {
      await getContacts();
    }
    
    updateData()
  }

  // Callback function for child component to request a deletion of current record.
  async function deleteContact(id) {
    let getResponse = async () => {
      return await addressBook.deleteContact(id)
    }
    // Wait for API request to complete
    await getResponse()
    updateContacts(); // Update local state with refreshed collection

    // After deleting record, go back to default form view
    setViewMode({
      showContactCard: false,
      contact: null
    });

    setFormEditMode(false)
  }

  // Functional component to render upper half of app with a form or with a contact card
  function ShowUpperContent() {
    if (viewMode.showContactCard === false) {
      return <ContactForm viewMode={formEntryMode()} setView={propsObj} contact={viewMode.contact} updateContacts={updateContacts}/>
    } else {
      return <ContactCard contact={viewMode.contact} setView={propsObj} deleteContact={deleteContact} />
    }
  }

  return (
    <div className="App container">
      <TitleBar />
      <ShowUpperContent/>
      <br/>
      {(contacts) ? <Contacts setView={propsObj} contacts={contacts}/> : null}
    </div>
  );
}

export default App;

