import {GetServerSideProps} from 'next';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import styles from '../../styles/ChannelId.module.css';
import { redirectTo } from '@/helpers/redirect';

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const {req} = context;
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader ? cookieHeader?.split('; ')
        .find((cookie) => cookie.trim().startsWith('jwttoken='))
        ?.split('=')[1]
        : null; 
    if(token == null){
        return{
            redirect: {
                destination: '/login',
                permanent:false
            }
        };
    }
    const request = await fetch('http://localhost:8080/messages/channel/'+context.query.channelId,{
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        })
    const data = await request.json();
    return {
        props:{
            messages:data.messages
        }
    }
}

export default function messages({messages}:any){
    const [onlineMessages,setOnlineMessages] = useState(messages.sort((a:any,b:any) => a.id - b.id));
    const shouldFetchData = true;
    const cookies = new Cookies()
    const router = useRouter();
    const refreshMessages = async () => {
        const request = await fetch('http://localhost:8080/messages/channel/'+router.query.channelId,{
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const data = await request.json()
        setOnlineMessages(data.messages.sort((a:any,b:any) => a.id - b.id))
    }
    const sendMessage = async () => {
        let inpMess = document.getElementById('messaging') as HTMLInputElement;
        let value = inpMess.value
        let sending = {
            channelId:router.query.channelId,
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
        refreshMessages()
    }
    useEffect(()=>{
        if(shouldFetchData){
            const timer = setInterval(()=>{refreshMessages()},1000)
            return () => {
                clearTimeout(timer)
            }
    }},[onlineMessages])
    return (
    <>
    <div className={styles.main}>
        <div className={styles.messages}>
            <h2>Messages</h2> <hr/>
            {onlineMessages.map((message:any) => {
                return(
                    <div key={message.id}>
                        <p>{message.content}</p>
                    </div>
                )
            })}
            <div>
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." />
            <button onClick={()=>sendMessage()}>Send</button>
            </div>
        </div>
        <div className={styles.members}>
            <h2>Members</h2>
            <button onClick={()=>redirectTo('/channel/edit/'+router.query.channelId)}>Edit channel</button>
        </div>
    </div>
    </>
    )
}