import React from 'react'
import { useRef } from 'react';
import ContactFormSubmitButton from './ContactFormSubmitButton'
import styles from './ContactForm.module.css'
import { addressBook } from '../appdata/AddressBookData';

// Component for contact entry/editing form. 
export default function ContactForm(props) {

    // Async function to send form data to addressBook class instance to handle API request and update collection of records
    async function submitForm(JSONData, action = 'Add') {

        let getResponse = async () => {
            
            if (action === 'Add') { // Send to POST handling method
                return await addressBook.createContact(JSONData)
            }

            if (action === 'Update') { // Send to PUT handling method
                return await addressBook.updateContact(JSONData)
            }
        }
        
        let response = await getResponse(); // Wait for response to return from API call
        updateContacts() // Update records
        return response; // Return response to caller
    }

    const updateContacts = props.updateContacts; // Callback method to handle updating of records

    // Form data refs
    const refFirstName = useRef();
    const refLastName = useRef();
    const refAddress = useRef();
    const refCity = useRef();
    const refState = useRef();
    const refZip = useRef();
    const refPhoneNumber = useRef();

    // Prefill form with contact data if exists
    let contact = {
        FirstName: (props.contact !== null)? props.contact.FirstName : null,
        LastName: (props.contact !== null)? props.contact.LastName : null,
        StreetAddress: (props.contact !== null)? props.contact.StreetAddress : null,
        City: (props.contact !== null)? props.contact.City : null,
        StateCode: (props.contact !== null)? props.contact.StateCode : null,
        ZipCode: (props.contact !== null)? props.contact.ZipCode : null,
        PhoneNumber: (props.contact !== null)? props.contact.PhoneNumber : null
    }

    // Detemines rendering of form button layout according to form mode passed in from parent.
    function ButtonControls() {
        switch (props.viewMode) {
            case 'NewContact': // Default form mode for new contact entry has single button control
                return <ContactFormSubmitButton styles={styles} value='Add' onClick={handleClick}/>
            case 'EditContact': // Edit mode has 'Update' and 'Cancel' buttons
                return <><ContactFormSubmitButton styles={styles} value='Update' onClick={handleClick}/><ContactFormSubmitButton styles={styles} value='Cancel' onClick={handleClick}/></>
            default:
                return null
        }
    }

    // Determines rendering of form title according to form mode passed in from parent.
    function Heading() {
        switch (props.viewMode) {
            case 'NewContact':
                return <div className="col-12 pl-4 mt-5 mb-4 text-primary text-center"><h3>Add New Contact</h3></div>
            case 'EditContact':
                return <div className="col-12 pl-4 mt-5 mb-4 text-primary text-center"><h3>Edit Contact</h3></div>
            default:
                return null
        }
    }

    // Function to handle click event
    async function handleClick(value) {

        // If cancel button, callback method to render default form entry mode
        if (value === 'Cancel') {
            let obj = {
                showContactCard: false,
                contact: null
            }
            props.setView.showContactCard(obj);

        } else if (value === 'Add' || value === 'Update') { // If 'Add' button or 'Update' button clicked
            
            // Populate object fields with form field values
            let contactObj = {
                FirstName: refFirstName.current.value,
                LastName: refLastName.current.value,
                StreetAddress: refAddress.current.value,
                City: refCity.current.value,
                StateCode: refState.current.value,
                ZipCode: refZip.current.value,
                PhoneNumber: refPhoneNumber.current.value
            }

            // If update button was clicked, then there is an existing ID value we need to add to contact object
            if (value === 'Update' && props.contact !== undefined) {
                contactObj.id = props.contact.id
            }
            
            // New contacts do not have ID value until object is created. Wait for response object.
            let response = await submitForm(contactObj, value);
            
            // If this was a new contact, missing ID field, assign ID field from response to contact object
            // ID is needed to assign unique key value for ContactCard component
            if (response.id !== undefined && contactObj.id !== response.id) {
                contactObj.id = response.id;
            }

            // Reuired object that callback function expects to indicate what to render in upper half of app
            // In this case, for a new or updated contact, we indicate to show contact card component using the contact object details
            let obj = {
                showContactCard: true,
                contact: contactObj
            }

            // Callback function with object indicating desired view
            props.setView.showContactCard(obj);
        } 
    }

    // Render entry form according to prop fields indicating whether form is for new contact entry or for editing existing contact
    return (
        <div className="row px-4">
            
            <form className={`form-group col-sm-8 ${styles.formContainer}`}>
                <div className="row">
                    <Heading />
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="First Name" defaultValue={contact.FirstName} ref={refFirstName} />
                    </div>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" placeholder="Last Name" defaultValue={contact.LastName} ref={refLastName} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        <input type="text" className="form-control" placeholder="Address" defaultValue={contact.StreetAddress} ref={refAddress} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-5">
                        <input type="text" className="form-control" placeholder="City" defaultValue={contact.City} ref={refCity} />
                    </div>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" placeholder="State" defaultValue={contact.StateCode} ref={refState} />
                    </div>
                    <div className="col-sm-4">
                        <input type="text" className="form-control" placeholder="Zip" defaultValue={contact.ZipCode} ref={refZip} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        <input type="tel" className="form-control" placeholder="Phone Number" defaultValue={contact.PhoneNumber} ref={refPhoneNumber} />
                    </div>
                </div>
                <div className="row"><div className="col-12"><br /></div></div>
                <div className={styles.formControls}>
                    <ButtonControls viewMode={props.setView}/>
                </div>
                
            </form>
            
        </div>
    )
}
