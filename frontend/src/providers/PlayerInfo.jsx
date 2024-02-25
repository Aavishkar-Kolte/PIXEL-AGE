import React, { useContext, useState } from "react";

// Context for the player information
const PlayerContext = React.createContext(null);

// Custom hook to access the player information from the context
export const usePlayerInfo = () => {
    return useContext(PlayerContext);
}

export const PlayerProvider = (props) => {
    // State variables for the player information
    const [lobbyCode, setLobbyCode] = useState('');
    const [name, setName] = useState('');
    const [thisPlayerId, setThisPlayerId] = useState('');
    const [isGameHost, setIsGameHost] = useState(null);
    const [isPlayOnline, setIsPlayOnline] = useState(false);

    return (
        <PlayerContext.Provider value={{
            lobbyCode,
            setLobbyCode,
            name,
            setName,
            thisPlayerId,
            setThisPlayerId,
            isGameHost,
            setIsGameHost,
            isPlayOnline,
            setIsPlayOnline
        }}>
            {props.children}
        </PlayerContext.Provider>
    )
}