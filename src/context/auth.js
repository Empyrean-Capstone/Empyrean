import {io} from "socket.io-client";
import React from 'react';

export const auth = io("localhost:5000/", {transports: ["websocket"] });
export const SocketContext = React.createContext();
