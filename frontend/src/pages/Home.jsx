import React from 'react';
import { useNavigate } from 'react-router-dom';



function HomePage() {
    const navigate = useNavigate();
    return (
        <div className='flex-center'>
            <div className='homepage-container'>
                <div className='header'>
                    <h1 className='logo'>PIXEL-AGE</h1>
                    <button id='header-option' onClick={() => { navigate("/about") }} >ABOUT</button>

                </div>
                <div className="form-div" >
                    <button className="button-confirm" role="button" onClick={() => { navigate('/create-lobby') }}>CREATE-GAME-LOBBY</button>
                    <button className="button-confirm" role="button" onClick={() => { navigate('/join-lobby') }}>JOIN-GAME-LOBBY</button>
                    <button className="button-confirm" role="button" onClick={() => { navigate('/play-online') }}>PLAY-ONLINE</button>
                </div>
                <h3 id='home-vp-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
                <div className='scroll-down'>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className='game-tutorial-and-ads-outer-div'>
                <div className='game-tutorial-and-ads-div'>
                    <div className='game-tutorial'>
                        <h2>GAME TUTORIAL</h2>
                        <div className='controls-div'>
                            <div className='control'>
                                <h4>MOVE</h4>
                                <img src='./img/run.gif' />
                                <div>
                                    <img width="40" height="40" src=".\img\icons8-a-key-50.png" alt="a-key" />
                                    <img width="40" height="40" src=".\img\icons8-d-key-50.png" alt="d-key" />
                                </div>
                            </div>
                            <div className='control'>
                                <h4>JUMP</h4>
                                <img src='./img/jump.gif' />
                                <div>
                                    <img width="40" height="40" src=".\img\icons8-w-key-50.png" alt="w-key" />
                                </div>
                            </div>
                            <div className='control'>
                                <h4>ATTACK</h4>
                                <img src='./img/attack.gif' />
                                <div>
                                    <img width="60" height="50" src=".\img\icons8-space-key-50.png" alt="space-key" />
                                </div>
                            </div>

                            <div className='control'>
                                <h4>DEFEND</h4>
                                <img src='./img/defend.gif' />
                                <div>
                                    <img width="40" height="40" src=".\img\icons8-k-key-50.png" alt="k-key" />
                                </div>
                            </div>

                        </div>
                        <div id="instructions">
                            <h5>When you press the 'k' key to defend, your character enters a fortified stance, reducing incoming damage by 75%. However, this increased defense comes at a cost – your movement speed decreases by 75%, and you temporarily lose the ability to attack. Use this defensive move strategically to withstand powerful enemy attacks.</h5>
                        </div>
                    </div>
                    <br></br>
                    <br></br>

                    {/* <div className='ad-home'>

                    </div> */}
                </div>
            </div>
            <footer className='footer'>
                <h5>Developed by Aavishkar Kolte, email: aavishkarkolte@gmail.com</h5>
            </footer>
        </div>
    )
}


export default HomePage;