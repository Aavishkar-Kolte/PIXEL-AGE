import React, { useContext, useRef, useState } from "react";

const PlayerContext = React.createContext(null);

export const usePlayerInfo = () => { return useContext(PlayerContext) }

export const PlayerProvider = (props) => {
    const [lobbyCode, setLobbyCode] = useState('');
    const [name, setName] = useState('');
    const [thisPlayerId, setThisPlayerId] = useState('');
    // const [opponentPlayerId, setOpponentPlayerId] = useRef('');
    

    return (
        <PlayerContext.Provider value={{ lobbyCode, setLobbyCode, name, setName, thisPlayerId, setThisPlayerId}}>
            {props.children}
        </PlayerContext.Provider>
    )
}