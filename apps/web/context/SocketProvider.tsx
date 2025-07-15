'use client'

import React, { createContext, FC, useCallback, useEffect } from 'react'
import { io } from 'socket.io-client';

interface SocketProviderProps{
    children?: React.ReactNode;
}
interface ISocketContext {
    sendMessage: (message: string) => any;
}

const SocketContext = createContext<ISocketContext | null>(null);

const SocketProvider: FC<SocketProviderProps>  = ({children})=> {
    const sendMessage: ISocketContext['sendMessage'] = useCallback((message)=>{
        console.log('Sending message:', message);
        // Here you would typically send the message through a WebSocket or similar
        // For example: socket.send(message);
    },[])

    console.log('SocketProvider rendered', sendMessage);

    useEffect(()=>{
        const _socket = io('http://localhost:5000');

        return () =>{
            console.log('Cleaning up socket connection');
            _socket.disconnect();
        }
    })


  return (
    <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider