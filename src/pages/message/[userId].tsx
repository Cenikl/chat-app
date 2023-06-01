import {GetServerSideProps} from 'next';
import {redirectTo} from "../../helpers/redirect";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { messageContent, Messages } from '@/typings/sendMessage';
import { schema } from '@/utils/messageVerify';
import { checkToken } from '@/helpers/token';
import { getToken } from '@/helpers/cookie';
import { handleformMessages } from '@/helpers/forms';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = checkToken(context);
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
    const [currentMessages,setCurrentMessages] = useState(messages.sort((a:any,b:any) => a.id - b.id));
    const [shouldFetchData,setShouldFetchData] = useState(true);
    const form = handleformMessages(schema)

    const takeMessages = async () =>{
       const request = await fetch('http://localhost:8080/messages/'+router.query.userId,{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer ' + getToken('jwttoken'),
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
                'Authorization' : 'Bearer '+getToken('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        takeMessages()
    }

   useEffect(()=>{
        if(shouldFetchData){
            const timer = setInterval(()=>{takeMessages()},5000)
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
        <form name="sendMessageForm" onSubmit={form.handleSubmit(sendMessage)} noValidate>
            <input type="text" 
                id="messaging" 
                placeholder="Enter your text here..." 
                {...form.register("message",{
                    required:{
                        value:true,
                        message: "Write your message here"
                }})}/>
            <p>{form.formState.errors.message?.message}</p>
            <button>Send</button>
            </form> <br />
            <button onClick={()=>redirectTo('/profile')}>Return to main page</button>
            </div>
    </div>
    </>
    )
}