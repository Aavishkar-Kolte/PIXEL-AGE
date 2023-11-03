import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';

function CreateLobbyPage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost } = usePlayerInfo();

    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    const HandleCreatedLobby = useCallback((data) => {
        setLobbyCode(data.lobbyCode);
        setName(data.name);
        setThisPlayerId(data.playerId);
        setIsGameHost(true);
        setIsReady(true);
    }, [setLobbyCode, setName, setThisPlayerId]);

    useEffect(() => {
        socket.on("created-lobby", HandleCreatedLobby);

        return () => {
            socket.off("created-lobby", HandleCreatedLobby);
        }
    }, [socket, HandleCreatedLobby]);

    useEffect(() => {
        if (isReady) {
            navigate(`/lobby/${lobbyCode}`);
        }
    }, [isReady, setLobbyCode, navigate]);

    return (
        <div className='createlobbypage-container'>
            <div>
                <div className='header'>
                    <h1 className='logo'>PIXEL-AGE</h1>
                    <button id='header-option'>DEVELOPER</button>

                </div>
                <div className='form-div'>
                     {/* <h1>CREATE LOBBY</h1> */}
                     <input type="text" placeholder="Enter Username" value={name} onChange={e => { setName(e.target.value) }} />
                    <button className="button-confirm" onClick={() => { socket.emit("create-lobby", { name }) }}> CREATE-LOBBY </button>
                </div>  
            </div>
        </div>
    )
}

export default CreateLobbyPage;


