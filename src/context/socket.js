import {io} from "socket.io-client";
import React from 'react';

export const socket = io("localhost:5000/", {transports: ["websocket"] });
export const SocketContext = React.createContext();
