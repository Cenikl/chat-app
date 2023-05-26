import styles from '../styles/Register.module.css'
import Router from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import Cookies from 'universal-cookie';
import {Register}  from "../typings/signupType"
import {schema}  from "../utils/signupVerify"

export default function register(){

    const form = useForm<Register>({
        resolver: yupResolver(schema)
    });
    const { register,handleSubmit, formState } = form; 
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
        if(response.status == false){
            alert(response.message)
        }
        else{
            const cookies = new Cookies();
            cookies.set('jwttoken',response.user.token);
            Router.push('/profile')
        }
    }
    else 
        alert("Password don't match");
    }


    return(
        <>
        <div className={styles.signup}>
        <h1 className={styles.title}>Sign-Up</h1> <hr />
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
            <p>{errors.email?.message}</p> <br />

            <input 
                type="password"  
                id={styles.form} 
                placeholder='Password'
                {...register("password",{required:{
                    value: true,
                    message: "Password is mandatory"
                }})} /> 
            <p>{errors.password?.message}</p> <br />

            <input 
                type="password" 
                placeholder='Confirm your password' 
                className={styles.cpass}
                id='cpassword' /> <br />

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
                type="text"
                id={styles.form}
                placeholder='Bio'
                {...register("bio",{
                    required:{
                        value:true,
                        message:"Bio is mandatory"
                    }})} /> <br />
            <p>{errors.bio?.message}</p> <br />

                <button className={styles.log}>Register</button>
            </form>
        </div>
        </>
    )
}