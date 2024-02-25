import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <h1 className="logo">PIXEL-AGE</h1>
            <button id="header-option" onClick={() => { navigate("/about") }}>
                ABOUT
            </button>
        </div>
    );
};
