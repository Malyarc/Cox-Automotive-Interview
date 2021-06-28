import React from "react";
import "./Terminal.css";
import Spinner from 'react-bootstrap/Spinner'

const Terminal = ({ data }) => {

    let jsonCode = JSON.stringify(data, null, 4);

    if (!data) {
        jsonCode =
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
    }

    return (

        <div className="window">
            <div className="title-bar">
                <div className="buttons">
                    <div className="mac-btn close" />
                    <div className="mac-btn minimize" />
                    <div className="mac-btn zoom" />
                </div>
                <p style={{ textAlign: "center", margin: 0 }}>
                    json-terminal
                </p>
            </div>
            <div className="content">
                <pre>{jsonCode}</pre>
            </div>
        </div>
    );
};

export default Terminal;