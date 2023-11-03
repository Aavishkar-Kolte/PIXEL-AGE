import React from 'react';
import { useNavigate } from 'react-router-dom';



function HomePage() {
    const navigate = useNavigate();
    return (
        <div>
            <div className='homepage-container'>
                <div className='header'>
                    <h1 className='logo'>PIXEL-AGE</h1>
                    <button id='header-option'>DEVELOPER</button>

                </div>
                <div className="form-div" >
                    <button className="button-confirm" role="button" onClick={() => { navigate('/create-lobby') }}>CREATE-GAME-LOBBY</button>
                    <button className="button-confirm" role="button" onClick={() => { navigate('/join-lobby') }}>JOIN-GAME-LOBBY</button>
                    <button className="button-confirm" role="button" onClick={() => { navigate('/play') }}>PLAY-ONLINE</button>
                </div>
            </div>
            <div className='game-tutorial'>
                Hello
            </div>
        </div>
    )
}


export default HomePage;