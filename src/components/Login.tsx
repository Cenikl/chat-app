import styles from '../styles/Login.module.css'
import {Login}  from "../typings/loginType";
import {schema}  from "../utils/loginVerify"
import {handleLogin} from "../components/handleLogin";
import {redirectTo} from "../helpers/redirect";
import {handleformLogin} from "../helpers/forms"

export function Login(){
    const form = handleformLogin(schema); 
    const signUp = () => {redirectTo('/sign-up')}
    const onSubmit = async (data: Login) => {handleLogin(data)}

    return (
        <>
        <div className={styles.login}>
            <h1 className={styles.title}>Sign-In</h1> <hr />
            <form name="loginForm" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <input 
                    type="email"  
                    id={styles.form} 
                    placeholder='Email'
                    {...form.register("email",
                    {required:{
                        value: true,
                        message: "Email is mandatory"
                    }})}/> 
                <p>{form.formState.errors.email?.message}</p>
                    <br />

                <input 
                    type="password"  
                    id={styles.form}  
                    placeholder='Password'
                    {...form.register("password",{required:{
                        value: true,
                        message: "Password is mandatory"
                    }})} /> 
                <p>{form.formState.errors.password?.message}</p>    
                    <br />
                <button className={styles.log}>Login</button>
            </form>
            <button 
                className={styles.log} 
                onClick={signUp}>Sign-up</button>
        </div>
        </>
    )
}