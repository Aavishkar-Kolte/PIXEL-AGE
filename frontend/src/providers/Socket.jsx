import React, { useMemo } from "react";
import { io } from "socket.io-client";

// Context for the socket
const SocketContext = React.createContext(null);

// Custom hook to access the socket context
export const useSocket = () => {
    return React.useContext(SocketContext);
};

export const SocketProvider = (props) => {
    const socketURL = process.env.REACT_APP_SOCKET_IO_URL;
    const socket = useMemo(() => io(socketURL), []);
    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    );
};
