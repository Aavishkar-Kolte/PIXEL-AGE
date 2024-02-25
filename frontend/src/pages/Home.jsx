import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollDownAnimation } from '../components/ScrollDownAnimation';
import { GameTutorial } from '../components/GameTutorial';


function HomePage() {
    const navigate = useNavigate();

    return (
        <div className='flex-center'>
            <div className='homepage-container'>
                <Header />
                <div className="form-div" >
                    <button className="button-confirm" onClick={() => { navigate('/create-lobby') }}>CREATE-GAME-LOBBY</button>
                    <button className="button-confirm" onClick={() => { navigate('/join-lobby') }}>JOIN-GAME-LOBBY</button>
                    <button className="button-confirm" onClick={() => { navigate('/play-online') }}>PLAY-ONLINE</button>
                </div>
                <h3 id='home-vp-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
                <ScrollDownAnimation />
            </div>
            <GameTutorial />
            <Footer />
        </div>
    )
}

export default HomePage;