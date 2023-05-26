import {GetServerSideProps} from 'next';
import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styles from '../../../styles/editChannel.module.css'
import { useRouter } from 'next/router';
import { editChannel } from '@/typings/editChannel';
import Cookies from 'universal-cookie';
import { redirectTo } from '@/helpers/redirect';

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

export default function editChannel({users}:any){
    const [memberObjects,setMemberObjects] = useState([]);
    const router = useRouter();
    const idMembers: number[] = [];
    const cookies = new Cookies();
    const onSelect = (user:any) => {
        setMemberObjects(user)
    }
    const onRemove = (user:any) => {
        setMemberObjects(user)
    }
    const addMembers = async() =>{
        const member:editChannel = {
            members:[]
        }
        for(let i =0; i < memberObjects.length;i++){
            idMembers.push(Number((memberObjects[i] as {id: string}).id))
        }
        member.members = idMembers
        const request = await fetch('http://localhost:8080/channels/'+router.query.channelId+'/members',{
            method: 'POST',
            body: JSON.stringify(member),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        if(response.status == true){
            redirectTo('/channel/'+router.query.channelId)
        }
        else{
            alert(response.message)
        }
    }
    return (
    <>
    <div className={styles.main}>
        <form >
        <Multiselect
            options={users}
            showCheckbox
            displayValue="name"
            onSelect={(user) =>{onSelect(user)}}
            onRemove={(user) =>{onRemove(user)}}
        />
        </form>
        <button onClick={()=>addMembers()}>Add members</button>
    </div>
    </>
    )
}