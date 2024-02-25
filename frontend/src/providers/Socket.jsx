import React, { useMemo } from "react";
import { io } from "socket.io-client";

// Context for the socket
const SocketContext = React.createContext(null);

// Custom hook to access the socket context
export const useSocket = () => {
    return React.useContext(SocketContext);
};

export const SocketProvider = (props) => {
    const socket = useMemo(() => io("http://localhost:8000"), []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    );
};
