import Cookies from 'universal-cookie';
import styles from '../../styles/Main.module.css';
import axios from 'axios';
import {GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { useEffect, useState } from 'react';

type Message = {
    id: number,
    content: string,
    createdAt: string,
    updatedAt: string,
    senderId: number,
    recipientId: null,
    channelId: number,
    sender: {
        id: number,
        name: string,
        email: string
    }
}

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const {req} = context;
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader ? cookieHeader?.split('; ')
        .find((cookie) => cookie.trim().startsWith('jwttoken='))
        ?.split('=')[1]
        : null; 

    const request = await fetch('http://localhost:8080/channels',{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    })
    const data = await request.json()
    return {
        props:{
            channels:data.channels,
        },
    }
}

export default function menu({channels}:any){
    const [messages,setMessages] = useState([]);
    const [shouldFetchData,setShouldFetchData] = useState(false);
    const cookies = new Cookies();
    const [currentChannel,setCurrentChannel] = useState(0);

    const focusChat = async (id:any) => {
        const request = await fetch('http://localhost:8080/messages/channel/'+id,{
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        setMessages(response.messages.sort((a:any,b:any) => a.id - b.id))
        setCurrentChannel((currentChannel) => id)
        setShouldFetchData(true)
    }

    const sendMessage = async () => {
        let inpMess = document.getElementById('messaging') as HTMLInputElement;
        let value = inpMess.value
        let sending = {
            channelId:currentChannel,
            recipientId:null,
            content:value
        } 
        const request = await fetch('http://localhost:8080/message',{
            method:'POST',
            body: JSON.stringify(sending),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        focusChat(currentChannel)
    }
    useEffect(()=>{
        if(shouldFetchData){
            const timer = setInterval(()=>{focusChat(currentChannel);console.log(currentChannel)},1000)
            return () => {
                clearTimeout(timer)
            }
    }},[currentChannel])
    return (
        <>
        <div className={styles.main}>
            <div className={styles.channel}>
            {channels.map((channel:any) => {
                return(
                    <div key={channel.id}>
                        <button onClick={() => focusChat(channel.id)}>{channel.name}</button>
                    </div>
                )
            })}
            </div>
            <div className={styles.messages}>
            {messages.map((message:any) => {
                return(
                    <div key={message.id}>
                        <p>{message.content}</p>
                    </div>
                )
            })}
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." />
            <button onClick={()=>sendMessage()}>Send</button>
            </div>
            <div className={styles.members}>

            </div>
        </div>
        </>
    )
}