import Router from 'next/router';
import styles from '../../styles/Register.module.css';

export default function register(){
    

    const register = () => {
        let error = 0;
        const name = document.getElementById('takename') as HTMLInputElement;
        if(!name.value){
            alert("The username is empty")
            error++;
        }
        const email = document.getElementById('takeemail') as HTMLInputElement;
        if(!email.value){
            alert("The email is empty")
            error++;
        }
        const pass = document.getElementById('takepassword') as HTMLInputElement;
        if(!pass.value){
            alert("The password is empty")
            error++
        }
        const cpass = document.getElementById('takecpass') as HTMLInputElement;
        if(!cpass.value){
            alert("Password doesn't match")
            error++
        }
        const bio = document.getElementById('takebio') as HTMLInputElement;
        if(!bio.value){
            alert("The bio is empty")
            error++
        }
        if(error == 0 ){
        localStorage.setItem(name.value,name.value);
        localStorage.setItem(email.value,email.value);
        localStorage.setItem(pass.value,pass.value);
        localStorage.setItem(bio.value,bio.value);
        Router.push('/main');
    }
    else {
        //Do nothing
    }
}
    return (
        <>
    <div className={styles.part2}>
        <div className={styles.login}>
            <div className={styles.titling}>
            <h1 className={styles.title}>CHAT - APP</h1>
            </div>
            <hr className={styles.ligne}/>


            <label 
                htmlFor="username" 
                className={styles.labeling}>Name :</label>
                <br />
        <input 
            type="text" 
            className={styles.inputing} 
            id="takename"
            name="username"
            placeholder="Put your name here..."/>
            <br />
            

            
            <label 
                htmlFor="email" 
                className={styles.labeling}>Email :</label>
                <br />
        <input 
            type='email'
            className={styles.inputing} 
            name="email"
            id="takeemail"
            placeholder="Put your email here..." /> 
            <br />



            <label 
                htmlFor="password" 
                className={styles.labeling}>Password :</label>
                <br />
        <input 
            type='password' 
            className={styles.inputing} 
            name="password"
            id="takepassword"
            placeholder="Put your password here..."/>
            <br />



            <label 
                htmlFor="cpass" 
                className={styles.labeling}>Confirm password :</label>
                <br />
        <input 
            type='password'
            className={styles.inputing} 
            name="cpass"
            id="takecpass"
            placeholder="Confirm your password here..."/>
            <br />


            <label 
                htmlFor="bio" 
                className={styles.labeling}>Bio :</label>
                <br />
        <input 
            type="text" 
            className={styles.inputing} 
            name="bio"
            id="takebio"
            placeholder="Put your bio here..."/>
            <br />
        <div className={styles.contain}>
            <button type='button' 
            className={styles.tolog}
            onClick={register}>Register</button>
        </div>
        </div>
        <hr />
    </div>
        </>
    )
}