import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollDownAnimation } from '../components/ScrollDownAnimation';
import { GameTutorial } from '../components/GameTutorial';
import { Helmet } from 'react-helmet-async';

function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>PIXEL-AGE</title>
                <meta
                    name='description'
                    content='PIXEL-AGE is a browser-based, online multiplayer game (2-player game) designed to play with friends
                        or to engage in random battles with opponents from around the world.'
                />
                <link rel='canonical' href='/' />
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
            </Helmet>

            <div className='flex flex-center flex-column'>
                <div className='flex flex-center flex-column background-img width-100p height-100vh'>
                    <Header />
                    <div className="form-div" >
                        <button className="button1" onClick={() => { navigate('/create-lobby') }}>CREATE-GAME-LOBBY</button>
                        <button className="button1" onClick={() => { navigate('/join-lobby') }}>JOIN-GAME-LOBBY</button>
                        <button className="button1" onClick={() => { navigate('/play-online') }}>PLAY-ONLINE</button>
                    </div>
                    <h3 id='home-tagline-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
                    <ScrollDownAnimation />
                </div>
                <GameTutorial />
                <Footer />
            </div>
        </>
    )
}

export default HomePage;