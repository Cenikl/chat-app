import {GetServerSideProps} from 'next';
import {schema} from "../../utils/mainVerify";
import {Channel, trueChannel}  from "../../typings/channelType";
import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styles from '../../styles/CreateChannels.module.css'
import { redirectTo } from '@/helpers/redirect';
import { checkToken } from '@/helpers/token';
import { handleformChannel } from '@/helpers/forms';
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

export default function channelCreate({users}:any){
    const form = handleformChannel(schema)
    const [memberObjects,setMemberObjects] = useState([])
    const idMembers: number[] = []

    const onSelect = (user:any) => {
        setMemberObjects(user)
    }
    const onRemove = (user:any) => {
        setMemberObjects(user)
    }

    const onSubmit = async (data:Channel) =>{
        for(let i =0; i < memberObjects.length;i++){
            idMembers.push(Number((memberObjects[i] as {id: string}).id))
        } 
        const trueChannel : trueChannel = {
            name:data.channelName,
            type:data.type,
            members: idMembers
        }
        const request = await fetch('http://localhost:8080/channel',{
            method: 'POST',
            body: JSON.stringify(trueChannel),
            headers:{
                'Authorization' : 'Bearer '+getToken('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json()
        if(response.status == true){
            redirectTo('/channel/'+response.channel.id)
        }
        else(
            alert(response.message)
        ) 

    }
    return (
    <>
    <div className={styles.create}>
        <form name="createChannelForm" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <input 
                type="text"  
                id="name" 
                placeholder='Name'
                {...form.register("channelName",
                {required:{
                    value: true,
                    message: "Put the name of the channel"
                }})}/> 
            <p>{form.formState.errors.channelName?.message}</p>
            <br />
            <select 
                id="type" 
                placeholder='Type of the channel'
                {...form.register("type",{required:{
                    value: true,
                    message: "Type is mandatory"
                }})} > 
                <option value="public">public</option>
                <option value="private">private</option>
                </select>
                <p>{form.formState.errors.type?.message}</p>    
                <br />
                <Multiselect
                options={users}
                showCheckbox
                displayValue="name"
                onSelect={(user) =>{onSelect(user)}}
                onRemove={(user) =>{onRemove(user)}}
                {...form.register("members")}
                />
                <button className="createChannelButton" >Create Channel</button>
        </form> <br />
        <button onClick={()=>redirectTo('/profile')}>Return to main page</button> <br />
        <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
    </div>
    </>
    )
}