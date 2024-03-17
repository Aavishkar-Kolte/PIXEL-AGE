import React from "react";

export const GameTutorial = () => {
    return (
        <div id='game-tutorial-container'>
            <div className='width-100p height-100p flex flex-center flex-column'>
                <h2>GAME TUTORIAL</h2>
                <div id='controls-container'>
                    {/* MOVE control */}
                    <div className='control'>
                        <h4>MOVE</h4>
                        <img src='./gif/run.gif' alt='run.gif' />
                        <div>
                            <img width="40" height="40" src="./img/key_icons/icons8-a-key-50.png" alt="a-key" />
                            <img width="40" height="40" src="./img/key_icons/icons8-d-key-50.png" alt="d-key" />
                        </div>
                    </div>
                    {/* JUMP control */}
                    <div className='control'>
                        <h4>JUMP</h4>
                        <img src='./gif/jump.gif' alt='jump.gif' />
                        <div>
                            <img width="40" height="40" src="./img/key_icons/icons8-w-key-50.png" alt="w-key" />
                        </div>
                    </div>
                    {/* ATTACK control */}
                    <div className='control'>
                        <h4>ATTACK</h4>
                        <img src='./gif/attack.gif' alt='attack.gif' />
                        <div>
                            <img width="60" height="40" src="./img/key_icons/icons8-space-key-50.png" alt="space-key" />
                        </div>
                    </div>
                    {/* DEFEND control */}
                    <div className='control'>
                        <h4>DEFEND</h4>
                        <img src='./gif/defend.gif' alt='defend.gif' />
                        <div>
                            <img width="40" height="40" src="./img/key_icons/icons8-k-key-50.png" alt="k-key" />
                        </div>
                    </div>
                </div>
                {/* Instructions */}
                <h5 id="game-instructions-text" className="text-center">When you press the 'k' key to defend, your character enters a fortified stance, reducing incoming damage by 75%. However, this increased defense comes at a cost – your movement speed decreases by 75%, and you temporarily lose the ability to attack. Use this defensive move strategically to withstand powerful enemy attacks.</h5>
            </div>
            <br></br>
            <br></br>
            {/* Ad section */}
            {/* <div className='ad-home'>

                </div> */}
        </div>

    );
}