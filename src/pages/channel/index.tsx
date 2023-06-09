import styles from '../../styles/Channel.module.css';
import {GetServerSideProps} from 'next';
import { redirectTo } from '@/helpers/redirect';
import { useState } from 'react';
import { checkToken } from '@/helpers/token';
import { removeToken } from '@/helpers/cookie';

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const token = checkToken(context)
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
                        <button 
                            className={styles.channel}
                            onClick={()=>redirectTo('/channel/'+channel.id)}>
                                {channel.name}
                        </button>
                    </div>
                )
            })}
            <button onClick={()=>redirectTo('/channel/create')}>Create a channel</button> <br />
            <button onClick={()=>redirectTo('/profile')}>Return to main page</button> <br />
            <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
        </div>
        </>
    )
}