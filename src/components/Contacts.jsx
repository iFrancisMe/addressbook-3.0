import React from 'react'
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ContactFormSubmitButton from './ContactFormSubmitButton';
import styles from './Contacts.module.css'
import NavBar from './NavBar';

// Component for rendering contact records from collection of records
export default function Contacts(props) {
    

    let [contacts, setContacts] = useState(null);  // State var/method for keeping copy of full collection of contacts
    let [filteredContacts, setFilteredContacts] = useState(null); // State var/method for holding filtered subset of collection

    // Obtain latest collection at first render
    useEffect(() => { 
        if (!contacts) {
            getContacts()
        }
    }, [])

    // Update state collections when props collection changes
    useEffect(() => {
        // If contact records exist
        if (contacts !== null) {
            updateData() // Affects Navbar which works based on contacts state (full collection)
            getNavBar('All') // Causes current subset collection (filteredContacts) to update with new data
        }
    }, [props.contacts])

    // Function to assign updated props collection to state
    function updateData() {
        setContacts(props.contacts)
    }

    // Function to call at first render, assigning passed in collection to state vars
    async function getContacts() { // Note: removed async keyword
        if (!contacts) {
            let getData = async () => {
                setContacts(props.contacts)
                setFilteredContacts(props.contacts);
            }
            await getData(); // Note: removed await call
        }
    }

    // Function to create or filter collection of starting characters for current collection of contacts
    function getNavBar(filterString) {
        
        // Proceed only if records exist
        if (!contacts) return null;
        
        // If no arguments passed, create collection of char values to pass into NavBar component for building NavBar
        if (filterString === undefined) {

            let obj = {
                charCollection: new Set([]) // Using a set so only unique values are kept
            }
    
            // Iterate through collection of contact records and send starting character of first name and last name to Set
            let getCharList = () => {
                for (let contact of contacts) {
                    obj.charCollection.add(contact.FirstName.substring(0,1).toUpperCase());
                    obj.charCollection.add(contact.LastName.substring(0,1).toUpperCase())
                }
            }
            // Call function
            getCharList();
            
            // Return collection
            return obj;

        } else { // Function is also a callback function called from Navbar component to filter contact records according to clicked value
            
            // If user clicks 'All' on NavBar, reassign filteredContacts a full copy of contact records
            if (filterString === 'All') {
                let collection = props.contacts.slice(0);
                setFilteredContacts(collection)

            } else { // Else any link on NavBar calls back this function, passing char value to filter results to match char value
                
                let collection = props.contacts.slice(0); // Work with copy of collection from props in case local copy is stale
                collection = contacts.filter((contact) => {
                    
                    if (contact.FirstName.toLowerCase().startsWith(filterString.toLowerCase()) || 
                        contact.LastName.toLowerCase().startsWith(filterString.toLowerCase())) {
                            return true;
                    } else {
                        return false;
                    }
                })
                // Assign subset of records to state collection
                setFilteredContacts(collection);
            }
        }
    }

    // Function for handling click on 'View' button nect to contact. Causes to render contact card for current record
    function handleClick(value, contactObj) {
        if (value === 'View') {
            let obj = {
                showContactCard: true,
                contact: contactObj
            }
            // Callback function to parent to determine upper view of app
            props.setView.showContactCard(obj);
        }
    }
    
    // Functional component for rendering records contained in current collection of filtered contacts
    function ContactList() {
        
        // Return null if no records
        if (!filteredContacts) {
            return null;
        }

        // For collecting table rows for each record
        let collection = [];
        
        // Iterate through records and build collection of table rows
        for (let index = 0; index < filteredContacts.length; index++) {
            
            collection.push(
                <tr key={index}>
                    <td>
                        {filteredContacts[index].FirstName}
                    </td>
                    <td>
                        {filteredContacts[index].LastName}
                    </td>
                    <td>
                        <ContactFormSubmitButton onClick={handleClick} contact={filteredContacts[index]} styles={styles} value={'View'} />
                    </td>
                </tr>
            )
        }
        // Return components to render
        return collection;
    }

    // Sort contacts array by field name string parameter
    function Sort(fieldName) {
        
        let collection = filteredContacts.slice();

        let sortCollection = (() => {
        
            collection.sort( function(a, b) {

                let contactA = a[fieldName].toLowerCase();
                let contactB = b[fieldName].toLowerCase();
    
                return (contactA < contactB) ? -1 : (contactA > contactB) ? 1 : 0;
            });
        })
        sortCollection()
        setFilteredContacts(collection)
    }

    // Renders bottom half of app with contact records and completed NavBar
    return(
        <div className={styles.contactListContainer} style={{marginTop: 30}}>
            <NavBar getNavBar={getNavBar}/>
            <br />
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th className={styles.tableHeader} onClick={() => {Sort('FirstName')}}>First Name</th>
                    <th className={styles.tableHeader} onClick={() => {Sort('LastName')}}>Last Name</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {(filteredContacts) ? <ContactList /> : null}
            </tbody>
            </Table>
        </div>
    )
}
