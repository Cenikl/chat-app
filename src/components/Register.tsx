import styles from '../styles/Register.module.css'
import {Register}  from "../typings/signupType"
import {schema}  from "../utils/signupVerify"
import {handleformRegister} from '@/helpers/forms';
import {handleRegister} from '@/components/handleRegister';

export default function Register(){
    const form = handleformRegister(schema);
    const onSubmit = async (data: Register) => {handleRegister(data)}
    return(
        <>
        <div className={styles.signup}>
        <h1 className={styles.title}>Sign-Up</h1> <hr />
            <form name="registrationForm" onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
                type="email"  
                id={styles.form}
                placeholder='Email' 
                {...form.register("email",
                {required:{
                    value: true,
                    message: "Email is mandatory"
                }})}/> 
            <p>{form.formState.errors.email?.message}</p> <br />

            <input 
                type="password"  
                id={styles.form} 
                placeholder='Password'
                {...form.register("password",{required:{
                    value: true,
                    message: "Password is mandatory"
                }})} /> 
            <p>{form.formState.errors.password?.message}</p> <br />

            <input 
                type="password" 
                placeholder='Confirm your password' 
                className={styles.cpass}
                id='cpassword'
                {...form.register("confirmPassword",{required:{
                    value: true,
                    message: "Password is mandatory"
                }})} /> <br />
            <p>{form.formState.errors.confirmPassword?.message}</p> <br />

                <button className={styles.registerButton}>Register</button>
            </form>
        </div>
        </>
    )
}