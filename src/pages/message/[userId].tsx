import {GetServerSideProps} from 'next';
import {redirectTo} from "../../helpers/redirect";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

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

    const sendMessage = async () => {
        let inpMess = document.getElementById('messaging') as HTMLInputElement;
        let value = inpMess.value
        let sending = {
            recipientId:router.query.userId,
            content:value
        } 
        await fetch('http://localhost:8080/message',{
            method:'POST',
            body: JSON.stringify(sending),
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
    </>
    )
}