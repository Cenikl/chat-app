import styles from '../../styles/Login.module.css'
import Router from 'next/router';
import {useForm} from 'react-hook-form';
import {DevTool} from '@hookform/devtools';
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";

const schema = yup.object({
    email: yup.
            string().
            email("Incorrect Format").
            required("Email is mandatory"),
    password: yup.
                string().
                required("Password is mandatory"),
    name: yup.
            string().
            required("Name is mandatory"),
    bio: yup.
            string().
            required("Bio is maybe mandatory")
})

type Register = {
    email:string
    password:string
    name:string
    bio:string
}

export default function register(){

    const form = useForm<Register>({
        resolver: yupResolver(schema)
    });
    const { register, control, handleSubmit, formState } = form; 
    const {errors} = formState ;

    const onSubmit = async (data: Register) => { 
        let cpass = document.getElementById("cpassword") as HTMLInputElement;
        let value = cpass.value;
        if(value == data.password ){
        const request = await fetch('http://localhost:8080/users',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        console.log(response);
        if(response.status == false){
            alert(response.message)
        }
        else{
            Router.push('/channel')
        }
    }
    else 
        alert("Password don't match");
    }


    return(
        <>
        <div className={styles.signup}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input 
                type="email"  
                id="email"
                placeholder='Email' 
                {...register("email",
                {required:{
                    value: true,
                    message: "Email is mandatory"
                }})}/> 
            <p>{errors.email?.message}</p> <br />

            <input 
                type="password"  
                id="password" 
                placeholder='Password'
                {...register("password",{required:{
                    value: true,
                    message: "Password is mandatory"
                }})} /> 
            <p>{errors.password?.message}</p> <br />

            <input 
                type="password" 
                placeholder='Confirm your password' 
                id='cpassword' /> <br />

                <input 
                    type="text" 
                    id='name' 
                    placeholder='Name'
                    {...register("name",{
                        required:{
                            value:true,
                            message: "Name is mandatory"
                        }})}/> <br />
            <p>{errors.name?.message}</p> <br />

            <input 
                type="text"
                id='bio'
                placeholder='Bio'
                {...register("bio",{
                    required:{
                        value:true,
                        message:"Bio is mandatory"
                    }})} /> <br />
            <p>{errors.bio?.message}</p> <br />

                <button>Register</button>
            </form>
            <DevTool control={control} />
        </div>
        </>
    )
}