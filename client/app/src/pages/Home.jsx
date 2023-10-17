import React from 'react';
import { useNavigate } from 'react-router-dom';



function HomePage() {
    const navigate = useNavigate();
    return (
        <div className='homepage-container'>
            <div className='btn-div'>
                <button className="button-50" role="button" onClick={() => { navigate('/create-lobby') }}>Create Game Lobby</button>
                <button className="button-50" role="button" onClick={() => { navigate('/join-lobby') }}>Join Game Lobby</button>
                <button className="button-50" role="button" onClick={() => { navigate('/play') }}>Play Online</button>
            </div>
        </div>
    )
}


export default HomePage;