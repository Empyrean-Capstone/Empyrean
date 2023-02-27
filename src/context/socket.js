import {io} from "socket.io-client";
import React from 'react';

export const socket = io("localhost:5000/");
export const SocketContext = React.createContext();
