import {GetServerSideProps} from 'next';
import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styles from '../../../styles/editChannel.module.css'
import { useRouter } from 'next/router';
import { editChannel } from '@/typings/editChannel';
import { redirectTo } from '@/helpers/redirect';
import { checkToken } from '@/helpers/token';
import { getToken, removeToken } from '@/helpers/cookie';

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

export default function editChannel({users}:any){
    const [memberObjects,setMemberObjects] = useState([]);
    const router = useRouter();
    const idMembers: number[] = [];
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
                'Authorization' : 'Bearer '+getToken('jwttoken'),
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
        <form name="editChannelForm">
        <Multiselect
            options={users}
            showCheckbox
            displayValue="name"
            onSelect={(user) =>{onSelect(user)}}
            onRemove={(user) =>{onRemove(user)}}
        />
        </form>
        <button onClick={()=>addMembers()}>Add members</button>
    </div> <br />
    <button onClick={()=>redirectTo('/profile')}>Return to main page</button> <br />
    <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
    </>
    )
}