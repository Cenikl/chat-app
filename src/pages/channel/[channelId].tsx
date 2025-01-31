import {GetServerSideProps} from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/ChannelId.module.css';
import { redirectTo } from '@/helpers/redirect';
import { useForm } from 'react-hook-form';
import { messageChannel, messageContent } from '@/typings/sendMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/utils/messageVerify';
import { checkToken } from '@/helpers/token';
import { getToken, removeToken } from '@/helpers/cookie';
import { parseDate } from '@/helpers/parseDate';

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const token = checkToken(context);
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
    const router = useRouter();
    const form = useForm<messageContent>({
        resolver: yupResolver(schema)
    });
    const { register,handleSubmit, formState } = form; 
    const {errors} = formState ;
    const refreshMessages = async () => {
        const request = await fetch('http://localhost:8080/messages/channel/'+router.query.channelId,{
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer '+getToken('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const data = await request.json()
        setOnlineMessages(data.messages.sort((a:any,b:any) => a.id - b.id))
    }
    const sendMessage = async (data:messageContent) => {
        const messaging : messageChannel = {
            channelId:router.query.channelId,
            content:data.message
        }
        await fetch('http://localhost:8080/message',{
            method:'POST',
            body: JSON.stringify(messaging),
            headers:{
                'Authorization' : 'Bearer '+getToken('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        refreshMessages()
        const form = document.forms.namedItem("sendMessageForm") as HTMLFormElement;
        form.reset();
    }
    useEffect(()=>{
        if(shouldFetchData){
            const timer = setInterval(()=>{refreshMessages()},5000)
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
                        <div className={styles.container}>
                        <h3>{message.sender.name} </h3>
                        <h4>{message.createdAt == message.updatedAt ? parseDate(message.createdAt) : parseDate(message.updatedAt)}</h4>                     
                        </div>
                        <p>{message.content}</p>
                    </div>
                )
            })}
            <div>
                <form name="sendMessageForm" onSubmit={handleSubmit(sendMessage)} noValidate>
                    <textarea 
                        id="messaging" 
                        placeholder="Enter your text here..." 
                        rows={3}
                        cols={50}
                        {...register("message",{
                            required:{
                                value:true,
                                message: "Write your message here"
                        }})}/>
                    <p>{errors.message?.message}</p>
                    <button className="sendMessageButton">Send Message</button>
                </form>
            </div>
        </div>
        <div className={styles.members}>
            <h2>Members</h2>
            <button onClick={()=>redirectTo('/channel/edit/'+router.query.channelId)}>Edit channel</button> <br />
            <button onClick={()=>redirectTo('/profile')}>Return to main page</button> <br />
            <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
        </div>
    </div>
    </>
    )
}