import styles from '../../styles/Channel.module.css';
import {GetServerSideProps} from 'next';
import { redirectTo } from '@/helpers/redirect';
import { useState } from 'react';
import { checkToken } from '@/helpers/token';
import { removeToken } from '@/helpers/cookie';

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const token = checkToken(context);
    const request = await fetch('http://localhost:8080/users',{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
            }
        })
    const data = await request.json()

    return {props:{
        users:data.users,
    }}
}

export default function messagesList({users}:any){
    const [newUsers,setUsers] = useState(users);

    return (
        <>
        <div className={styles.main}>
                <h1>Users List</h1>
            {newUsers.map((user:any) => {
                return(
                    <div key={user.id}>
                        <button 
                            className={styles.channel}
                            onClick={()=>redirectTo('/message/'+user.id)}>
                            {user.name}
                        </button>
                    </div>
                )
            })} <br />
            <button onClick={()=>redirectTo('/profile')}>Return to main page</button> <br />
            <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
        </div>
        </>
    )
}