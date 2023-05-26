import Cookies from 'universal-cookie';
import styles from '../../styles/Channel.module.css';
import {GetServerSideProps} from 'next';
import { redirectTo } from '@/helpers/redirect';
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

    return (
        <>
        <div className={styles.main}>
                <h1>Channel List</h1>
            {newChannel.map((channel:any) => {
                return(
                    <div key={channel.id}>
                        <button className={styles.channel}>{channel.name}</button>
                    </div>
                )
            })}
            <button onClick={()=>redirectTo('/channel/create')}>Create a channel</button>
        </div>
        </>
    )
}