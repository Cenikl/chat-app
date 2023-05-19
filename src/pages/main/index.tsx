import Cookies from 'universal-cookie';
import styles from '../../styles/Main.module.css';
import axios from 'axios';
import {GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';


export const getServerSideProps: GetServerSideProps = async (context) =>{
    const {req} = context;
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader ? cookieHeader?.split('; ')
        .find((cookie) => cookie.trim().startsWith('jwttoken='))
        ?.split('=')[1]
        : null; 

    console.log(token)

    const request = await fetch('http://localhost:8080/channels',{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    })
    const data = await request.json()
    console.log(data)
    return {
        props:{
            channels:data
        }
    }
}

export default function menu(){
    return (
        <>
        <div className={styles.main}>
            <div className={styles.channel}>
            </div>
            <div className={styles.messages}>

            </div>
            <div className={styles.members}>

            </div>
        </div>
        </>
    )
}