import React, { useContext, useState } from "react";

const PlayerContext = React.createContext(null);

export const usePlayerInfo = () => { return useContext(PlayerContext) }

export const PlayerProvider = (props) => {
    const [lobbyCode, setLobbyCode] = useState('');
    const [name, setName] = useState('');
    const [thisPlayerId, setThisPlayerId] = useState('');
    const [isGameHost, setIsGameHost]= useState(null);
    

    return (
        <PlayerContext.Provider value={{ lobbyCode, setLobbyCode, name, setName, thisPlayerId, setThisPlayerId, isGameHost, setIsGameHost}}>
            {props.children}
        </PlayerContext.Provider>
    )
}