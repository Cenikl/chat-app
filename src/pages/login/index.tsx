import styles from '../../styles/Login.module.css'
import Router from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import {Login}  from "../../components/login/type"
import {schema}  from "../../components/login/verify"
import Cookies from 'universal-cookie';

export default function login(){
    const form = useForm<Login>({
        resolver: yupResolver(schema)
    });
    const { register, handleSubmit, formState } = form; 
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
            <h1 className={styles.title}>Sign-In</h1> <hr />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <input 
                    type="email"  
                    id={styles.form} 
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
                    id={styles.form}  
                    placeholder='Password'
                    {...register("password",{required:{
                        value: true,
                        message: "Password is mandatory"
                    }})} /> 
                <p>{errors.password?.message}</p>    
                    <br />
                <button className={styles.log}>Login</button>
            </form>
        </div>
        </>
    )
}