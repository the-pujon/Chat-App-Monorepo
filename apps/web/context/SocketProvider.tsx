'use client'

import React, { createContext, FC, useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps{
    children?: React.ReactNode;
}
interface ISocketContext {
    sendMessage: (message: string) => any;
    messages: any[]
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const states = useContext(SocketContext);
    if(!states) throw new Error('State is undefined')

    return states
    
}

const SocketProvider: FC<SocketProviderProps>  = ({children})=> {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])
    console.log(socket)
    const sendMessage: ISocketContext['sendMessage'] = useCallback((message)=>{
        console.log('Sending message:', message);
        // Here you would typically send the message through a WebSocket or similar
        // For example: socket.send(message);
        if(socket) {
            console.log("sending")
            socket.emit("event:message", {message})
        }
    },[socket])

    // console.log('SocketProvider rendered', sendMessage);

    const onMessageRecive = useCallback((msg:string)=>{
        console.log("From server ", msg)
        const {message} = JSON.parse(msg) as {message: string}
         setMessages((prev) => [...prev, message]);
    },[])

    useEffect(()=>{
        const _socket = io('http://localhost:5000');
        setSocket(_socket)
        _socket.on("message", onMessageRecive)

        return () =>{
            console.log('Cleaning up socket connection');
            _socket.off("message", onMessageRecive)
            _socket.disconnect();
            setSocket(undefined)
        }
    },[])


  return (
    <SocketContext.Provider value={{sendMessage, messages}}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider