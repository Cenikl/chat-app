import styles from '../../styles/Login.module.css'
import Router from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
import Cookies from 'universal-cookie';

const schema = yup.object({
    email: yup.string().email("Incorrect Format").required("Email is mandatory"),
    password: yup.string().required("Password is mandatory")

})

type Login = {
    email:string
    password:string
}

export default function login(){
    const form = useForm<Login>({
        resolver: yupResolver(schema)
    });
    const { register, control, handleSubmit, formState } = form; 
    const {errors} = formState ;

    const onSubmit = async (data: Login) => { 
        const request = await fetch('http://localhost:8080/users/login',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json();
        if(response.status == false && response.statusCode == 404){
            alert(response.message)
            Router.push('/signup')
        }
        else if(response.status == false && response.statusCode == 401){
            alert(response.message)
        }
        else if(response.status == true){
                const cookies = new Cookies();
                cookies.set('jwttoken',response.user.token);
            Router.push('/main')
        }
    }

    return (
        <>
        <div className={styles.login}>
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
                <p>{errors.email?.message}</p>
                    <br />

                <input 
                    type="password"  
                    id="password" 
                    placeholder='Password'
                    {...register("password",{required:{
                        value: true,
                        message: "Password is mandatory"
                    }})} /> 
                <p>{errors.password?.message}</p>    
                    <br />
                <button >Login</button>
            </form>
        </div>
        </>
    )
}