import { Profile } from '@/typings/editProfileType';
import { Register } from '@/typings/signupType';
import { schema } from '@/utils/profileVerify';
import { yupResolver } from '@hookform/resolvers/yup';
import {GetServerSideProps} from 'next';
import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import {redirectTo} from "../helpers/redirect";
import styles from '../styles/Profile.module.css'

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
    const request = await fetch('http://localhost:8080/user',{
        method: 'GET',
        headers:{
            'Authorization' : 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    })
    const data = await request.json()
    return {
        props:{
            user:data.user,
        },
    }
}

export default function profil({user}:any){
    const createChannel = () => {redirectTo("/channel/create")}
    const messagesList = () => {redirectTo("/message")}
    const channelsList = () => {redirectTo("/channel")}
    const [editProfile,setEditProfile] = useState(false)
    const [profile,setProfile] = useState(user)
    const cookies = new Cookies()

    const form = useForm<Profile>({
        resolver: yupResolver(schema)
    });
    const { register,handleSubmit, formState } = form; 
    const {errors} = formState ;

    const onSubmit = async (data: Profile) => { 
        let cpass = document.getElementById("cpassword") as HTMLInputElement;
        let value = cpass.value;
        if(value == data.password ){
        const request = await fetch('http://localhost:8080/user',{
            method: 'PUT',
            body: JSON.stringify(data),
            headers:{
                'Authorization' : 'Bearer '+cookies.get('jwttoken'),
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        setProfile(response.user)
        setEditProfile(!editProfile)
        if(response.status == false){
            alert(response.message)
        }
    }
    else {
        alert("Password don't match");}
    

    }
    return (
        <>
            <div className={styles.main}>

            <div className={styles.profile}> 
            <h1>USER PROFILE</h1>
            <hr />
            {editProfile == false && <div>
            <h3>Name : </h3>
            {profile.name} <br />
            <h3>Email : </h3>
            {profile.email} <br />
            <h3>Bio : </h3>
            {profile.bio} <br />
            <h3>Joigned at : </h3>
            {profile.createdAt} <br />
            <button onClick={()=>{setEditProfile(!editProfile)}}>Edit profil</button>
            </div>
            }


            {editProfile == true && <div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <input 
                    type="text" 
                    id={styles.form} 
                    placeholder='Name'
                    {...register("name",{
                        required:{
                            value:true,
                            message: "Name is mandatory"
                        }})}/> <br />
                <p>{errors.name?.message}</p> <br />    

                <input 
                    type="password"  
                    id={styles.form} 
                    placeholder='OldPassword'
                    {...register("oldPassword",{required:{
                        value: true,
                        message: "Wrong old password"
                        }})} /> 
                <p>{errors.password?.message}</p> <br />

                <input 
                    type="password"  
                    id={styles.form} 
                    placeholder='New Password'
                    {...register("password",{required:{
                        value: true,
                        message: "Password is mandatory"
                        }})} /> 
                <p>{errors.password?.message}</p> <br />

            <input 
                type="password" 
                placeholder='Confirm your password' 
                className={styles.cpass}
                id='cpassword' /> <br /> <br />

            <input 
                type="text"
                id={styles.form}
                placeholder='Bio'
                {...register("bio",{
                    required:{
                        value:true,
                        message:"Bio is mandatory"
                    }})} /> <br />
            <p>{errors.bio?.message}</p> <br />

                <button >Register</button>
                </form>
                <button onClick={()=>{setEditProfile(!editProfile)}}>Cancel Edit profil</button>
                </div>}
            </div>

            <div className={styles.routing}>
                <button onClick={channelsList}>Channels</button> <br />
                <button onClick={messagesList}>Messages</button> <br />
                <button onClick={createChannel}>Create Channel</button>
            </div>

        </div>
        </>
    )
}