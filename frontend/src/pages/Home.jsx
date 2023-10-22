import React from 'react';
import { useNavigate } from 'react-router-dom';



function HomePage() {
    const navigate = useNavigate();
    return (
        <div className='homepage-container'>
            <div className='header'>
                <h1 className='logo'>PIXLE-AGE</h1>
                <button id='header-option'>Developer</button>

            </div>
            <div className="form-div" >
                <button className="button-confirm" role="button" onClick={() => { navigate('/create-lobby') }}>CREATE-GAME-LOBBY</button>
                <button className="button-confirm" role="button" onClick={() => { navigate('/join-lobby') }}>JOIN-GAME-LOBBY</button>
                <button className="button-confirm" role="button" onClick={() => { navigate('/play') }}>PLAY-ONLINE</button>
            </div>
        </div>
    )
}


export default HomePage;