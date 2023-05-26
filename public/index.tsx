import Cookies from 'universal-cookie';
import styles from '../../styles/Main.module.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import {GetServerSideProps} from 'next';
/*import {schema} from "../../utils/mainVerify";
import {Channel}  from "../../typings/channelType";*/
import { useEffect, useState } from 'react';

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

export default function messagesList({channels}:any){
    const [newChannel,setNewChannel] = useState(channels);
    const [messages,setMessages] = useState([]);
    const [shouldFetchData,setShouldFetchData] = useState(false);
    const cookies = new Cookies();
    const [currentChannel,setCurrentChannel] = useState(0);
    const form = useForm<Channel>({
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, formState } = form; 
    const {errors} = formState ;

    const onSubmit = async (data:Channel) =>{
        const request = await fetch('http://localhost:8080/channel',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        }) 
        const request2 = await fetch('http://localhost:8080/channels',{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer '+cookies.get('jwttoken'),
            'Content-Type': 'application/json'
        }
    })
    const response = await request2.json()
    setNewChannel(response.channels)

    }

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
            <div className={styles.channels}>
                <h1>Channel List</h1>
            {newChannel.map((channel:any) => {
                return(
                    <div key={channel.id}>
                        <button className={styles.channel} onClick={() => focusChat(channel.id)}>{channel.name}</button>
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
            {currentChannel > 0 && 
            <>
            <div>
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." />
            <button onClick={()=>sendMessage()}>Send</button>
            </div>
            </>}
            </div>
            <div className={styles.members}>

            </div>
        </div>
        </>
    )
}