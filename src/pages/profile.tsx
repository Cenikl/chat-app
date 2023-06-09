import { Profile, ProfileComplete } from '@/typings/editProfileType';
import { schema } from '@/utils/profileVerify';
import {GetServerSideProps} from 'next';
import { useState } from 'react';
import {redirectTo} from "../helpers/redirect";
import styles from '../styles/Profile.module.css'
import { checkToken } from '@/helpers/token';
import { handleformProfile } from '@/helpers/forms';
import { handleProfile } from '@/components/handleUpdateProfil';
import { getToken, removeToken } from '@/helpers/cookie';

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const token = checkToken(context)
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

export default function Profil({user}:any){
    const [editProfile,setEditProfile] = useState(false)
    const [profile,setProfile] = useState(user)
    const form = handleformProfile(schema)

    const onSubmit = async (data: Profile) => { 
        if(data.newPassword == data.confirmPassword ){
            const sendData : ProfileComplete = {
                name: data.name,
                oldPassword: data.currentPassword,
                password: data.newPassword,
                bio: data.bio
            } 
            const request = await fetch('http://localhost:8080/user',{
                method: 'PUT',
                body: JSON.stringify(sendData),
                headers:{
                    'Authorization' : 'Bearer '+getToken('jwttoken'),
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
            <div>
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
            <div>
                <form name="editProfileForm" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <input 
                    type="text" 
                    id={styles.form} 
                    placeholder='Name'
                    {...form.register("name",{
                        required:{
                            value:true,
                            message: "Name is mandatory"
                        }})}/> <br />
                <p>{form.formState.errors.name?.message}</p> <br />    

                <input 
                    type="password"  
                    id={styles.form} 
                    placeholder=' Current Password'
                    {...form.register("currentPassword",{required:{
                        value: true,
                        message: "Wrong old password"
                        }})} /> 
                <p>{form.formState.errors.currentPassword?.message}</p> <br />

                <input 
                    type="password"  
                    id={styles.form} 
                    placeholder='New Password'
                    {...form.register("newPassword",{required:{
                        value: true,
                        message: "Password is mandatory"
                        }})} /> 
                <p>{form.formState.errors.newPassword?.message}</p> <br />

            <input 
                type="password" 
                placeholder='Confirm your password' 
                className={styles.cpass}
                id='cpassword'
                {...form.register("confirmPassword",{required:{
                    value: true,
                    message: "Password is mandatory"
                    }})} /> <br /> <br />
                <p>{form.formState.errors.confirmPassword?.message}</p> <br />

            <input 
                type="text"
                id={styles.form}
                placeholder='Bio'
                {...form.register("bio",{
                    required:{
                        value:true,
                        message:"Bio is mandatory"
                    }})} /> <br />
            <p>{form.formState.errors.bio?.message}</p> <br />

                <button className="updateProfileButton" >Update Profile</button>
                </form>
                <button onClick={()=>{setEditProfile(!editProfile)}}>Cancel Edit profil</button>
                </div>
            </div>

            <div className={styles.routing}>
                <button onClick={()=>redirectTo("/channel")}>Channels</button> <br />
                <button onClick={()=>redirectTo("/message")}>Messages</button> <br />
                <button onClick={()=>redirectTo("/channel/create")}>Create Channel</button> <br />
                <button onClick={()=>{removeToken("jwttoken");redirectTo("/login")}}>Logout</button>
            </div>

        </div>
        </>
    )
}