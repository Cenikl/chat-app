import {GetServerSideProps} from 'next';
import {redirectTo} from "../../helpers/redirect";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { messageContent, Messages } from '@/typings/sendMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/utils/messageVerify';

export const getServerSideProps: GetServerSideProps = async (context) => {
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
        const request = await fetch('http://localhost:8080/messages/'+context.query.userId,{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
            }
        })
        const data = await request.json()
    return {
        props:{
            messages:data.messages,
        },
    }

}


export default function messages({messages}:any){
    const router = useRouter();
    const cookies = new Cookies();
    const [currentMessages,setCurrentMessages] = useState(messages.sort((a:any,b:any) => a.id - b.id));
    const [shouldFetchData,setShouldFetchData] = useState(true);
    const form = useForm<messageContent>({
        resolver: yupResolver(schema)
    });
    const { register,handleSubmit, formState } = form; 
    const {errors} = formState ;

    const takeMessages = async () =>{
       const request = await fetch('http://localhost:8080/messages/'+router.query.userId,{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer ' + cookies.get('jwttoken'),
            'Content-Type': 'application/json'
            }
        })
        const data = await request.json()
        setCurrentMessages(data.messages.sort((a:any,b:any) => a.id - b.id))
    }

    const sendMessage = async (data:messageContent) => {
        const messaging : Messages = {
            recipientId:router.query.userId,
            content:data.message
        }
        await fetch('http://localhost:8080/message',{
            method:'POST',
            body: JSON.stringify(messaging),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        takeMessages()
    }

   useEffect(()=>{
        if(shouldFetchData){
            const timer = setInterval(()=>{takeMessages()},1000)
            return () => {
                clearTimeout(timer)
            }
    }},[currentMessages])

    return (
    <>
    <div>
    {currentMessages.map((message:any) => {
                return(
                    <div key={message.id}>
                        <h3>{message.sender.name}</h3>
                        <h4>{message.createdAt == message.updatedAt ? message.createdAt : message.updatedAt}</h4>
                        <p>{message.content}</p>
                    </div>
                )
            })}
    <div>
        <form name="sendMessageForm" onSubmit={handleSubmit(sendMessage)} noValidate>
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." 
                {...register("message",{
                    required:{
                        value:true,
                        message: "Write your message here"
                }})}/>
            <p>{errors.message?.message}</p>
            <button>Send</button>
            </form>
            </div>
    </div>
    </>
    )
}