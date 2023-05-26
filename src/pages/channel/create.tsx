import Cookies from 'universal-cookie';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import {GetServerSideProps} from 'next';
import {schema} from "../../utils/mainVerify";
import {Channel}  from "../../typings/channelType";
import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styles from '../../styles/CreateChannels.module.css'
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

export default function channelCreate({users}:any){
    const form = useForm<Channel>({
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, formState } = form; 
    const cookies = new Cookies();
    const {errors} = formState ;
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
        data.members = idMembers
        const request = await fetch('http://localhost:8080/channel',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input 
                type="text"  
                id="name" 
                placeholder='Name'
                {...register("name",
                {required:{
                    value: true,
                    message: "Put the name of the channel"
                }})}/> 
            <p>{errors.name?.message}</p>
            <br />
            <select 
                id="type" 
                placeholder='Type of the channel'
                {...register("type",{required:{
                    value: true,
                    message: "Type is mandatory"
                }})} > 
                <option value="public">public</option>
                <option value="private">private</option>
                </select>
                <p>{errors.type?.message}</p>    
                <br />
                <Multiselect
                options={users}
                showCheckbox
                displayValue="name"
                onSelect={(user) =>{onSelect(user)}}
                onRemove={(user) =>{onRemove(user)}}
                />
                <button >Create</button>
        </form>
    </div>
    </>
    )
}