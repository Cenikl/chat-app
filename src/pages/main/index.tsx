import Cookies from 'universal-cookie';
import styles from '../../styles/Main.module.css';
import axios from 'axios';
import {GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { useState } from 'react';

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

    console.log(token)

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
    const [messages,setMessages] = useState<Message[]>([]);
    const cookies = new Cookies();
    const focusChat = async (id:any) => {
        const request = await fetch('http://localhost:8080/messages/channel/'+id,{
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        setMessages(response.messages)
        messages?.sort((a,b) => b.id - a.id)
        return "hello world" 
    }
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
            </div>
            <div className={styles.members}>

            </div>
        </div>
        </>
    )
}