import React from 'react'

// Component showing app title at top of app
export default function TitleBar() {
    return (
        <div className="row bg-primary">
            <div className="col-sm-2"></div>
            <div className="col-lg px-5 py-2 text-center">
                <span className="text-arial text-light display-3">Address Book</span>
            </div>
            <div className="col-sm-2"></div>
        </div>
    )
}
