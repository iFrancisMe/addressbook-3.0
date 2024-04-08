import React from 'react'

// Component for reusable form button 
export default function ContactFormSubmitButton(props) {

    // Click handler calls callback function to render contact card on top half of app
    function handleClick() {

        let contact = null;

        if (props.contact !== undefined && props.contact !== null) {
            contact = props.contact;
        } 
        // Send button value so function knows what button was clicked. Send contact object so callback function can render appropriate record data
        props.onClick(props.value, contact)
    }

    let styles = {}
    // styles object passed in as props for CSS handling of styling
    if (props.styles !== undefined) {
        styles = props.styles;
    } 
    
    return (
        <input type="button" className={`btn btn-primary btn-sm ${styles.actionButton}`} onClick={handleClick} value={props.value} />
    )
}
