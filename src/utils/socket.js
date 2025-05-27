import {BASE_URL} from './constants.js'
import { useEffect } from "react";
import { io } from "socket.io-client";


export const createSocket = ()=>{
    return io(BASE_URL);
}