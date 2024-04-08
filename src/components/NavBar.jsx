import React from 'react'

// Component allowing filtering of contacts by selecting an anchor link to filter results by starting letter
export default function NavBar(props) {

    // Click handler to callback function at parent sending char value to filter ContactList component
    function handleClick(char) {
        props.getNavBar(char)
    }

    // Build list items using array of characters passed from parent
    function NavLinks() {
        if (props.getNavBar !== undefined && props.getNavBar() !== null) {

            let set = props.getNavBar().charCollection
            let collection = Array.from(set).sort(); // Convert Set to Array for iteration
            let links = [];

            // Collection of list items for returning
            for (let char of collection) {
                links.push(
                    <li className="nav-item" key={char}>
                        <span className="nav-link" onClick={() => {handleClick(char)}}>{char}</span>
                    </li>
                    )
            }
            // Return completed list
            return links
        }
        // Return null if array not passed in
        return null
    }

    // For overriding CSS if styles object passed in as props from parent
    let styles = {};
    if (props.styles !== undefined) {
        styles = props.styles;
    }

    // Return completed navbar
    return (
        <div className={styles.NavBar}>
            <ul id='navbar' className="nav justify-content-center" style={{cursor: 'pointer'}}>
                <li className="nav-item">
                    <span className="nav-link" onClick={() => {handleClick('All')}}>All</span>
                </li>
                <NavLinks/>
            </ul>
        </div>
    )
}
