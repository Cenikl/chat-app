import Cookies from 'universal-cookie';
import styles from '../../styles/Main.module.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
import {GetServerSideProps} from 'next';
import { useEffect, useState } from 'react';

const schema = yup.object({
    name: yup.string().required("Put the name of the channel"),
    type: yup.string().required("Type is mandatory"),
    members: yup.string().notRequired()
})

type Channel = {
    name:string,
    type:string,
    members:string
}

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

export default function menu({channels}:any){
    const [newChannel,setNewChannel] = useState(channels);
    const [messages,setMessages] = useState([]);
    const [shouldFetchData,setShouldFetchData] = useState(false);
    const cookies = new Cookies();
    const [currentChannel,setCurrentChannel] = useState(0);
    const [isOpen,setIsOpen] = useState(false);
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
            <div className={styles.channel}>
            {newChannel.map((channel:any) => {
                return(
                    <div key={channel.id}>
                        <button onClick={() => focusChat(channel.id)}>{channel.name}</button>
                    </div>
                )
            })}
            <button onClick={()=>{setIsOpen(!isOpen)}}> Create a channel</button>
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
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." />
            <button onClick={()=>sendMessage()}>Send</button>
            </>}
            </div>
            <div className={styles.members}>

            </div>
        </div>


        {isOpen && 
            <div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <input 
                    type="text"  
                    id="name" 
                    placeholder='Name'
                    {...register("name",
                    {required:{
                        value: true,
                        message: "Put the name of the channel"
                    }})}/> 
                <p>{errors.name?.message}</p>
                    <br />

                <input 
                    type="text"  
                    id="type" 
                    placeholder='Type of the channel'
                    {...register("type",{required:{
                        value: true,
                        message: "Type is mandatory"
                    }})} /> 
                <p>{errors.type?.message}</p>    
                    <br />
                
                <input 
                    type="text"  
                    id="members" 
                    placeholder='Members (actually not working, dont put anything here yet)'
                    {...register("members")}/> 
                    <br />

                <button >Create</button>
            </form>
            </div>}
        </>
    )
}