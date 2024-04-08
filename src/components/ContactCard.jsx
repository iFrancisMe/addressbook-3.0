import React from 'react'
import styles from './ContactCard.module.css'

// Component to show selected contact record details printed on a contact card 
export default function ContactCard(props) {

    // Handler for 'Edit' button. Instructs to close card view and render edit form using this record data
    function handleEdit() {
        props.setView.showContactCard(
            {
                showContactCard: false,
                contact: props.contact
            }
        )
    }

    // Handler for 'Close' button. Instructs to close card.
    function handleClose() {
        props.setView.showContactCard(
            {
                showContactCard: false,
                contact: null
            }
        )
    }

    // Handler for 'Delete' button. Sends contact ID to callback function, which will in turn send ID to API method for record deletion
    function handleDelete() {
        props.deleteContact(props.contact.id)
    }

    // Card component with populated fields from contact object passed in as props
    function Card() {
        let cardInfo = [
            <div key={props.contact.id} className={`${styles.cardInfo}`}>
                Name: {props.contact.FirstName} {props.contact.LastName}<br />
                Address: {props.contact.StreetAddress}<br />
                City: {props.contact.City}<br />
                State: {props.contact.StateCode} &emsp; &emsp; Zip: {props.contact.ZipCode}<br />
                Phone: {props.contact.PhoneNumber}
            </div>
        ]

        return cardInfo;
    }

    // Button layout component for card
    function CardControls() {
        return  <div className={styles.cardControls}>
                        
                    <input  type="button" className="btn btn-primary" value="Edit" onClick={handleEdit}/>
                
                    <input  type="button" className="btn btn-primary" value="Delete" onClick={handleDelete}/>
                
                    <input  type="button" className="btn btn-primary" value="Close" onClick={handleClose}/>

                </div>
    }

    return (
        <div  className={styles.cardContainer}>
            
            <form>
                <div >
                    <div><h3>Contact Card</h3></div>
                </div>
                <div>

                    <Card />
                    <CardControls />
                    
                </div> 
                <div className="row"><div className="col-12"><br /></div></div>
                
            </form>
            
        </div>
    )
}
