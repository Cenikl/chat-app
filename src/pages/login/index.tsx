import styles from '../../styles/Login.module.css'
import Router from 'next/router';
export default function login(){
    /*const login = () => {
            const name = document.getElementById('takename') as HTMLInputElement; 
            const pass = document.getElementById('takepass') as HTMLInputElement;
            const item = window.localStorage.getItem(name.value);
            const item2 = window.localStorage.getItem(pass.value);
            if (name.value == item && name.value != "") {
                if(pass.value == item2 && pass.value != ""){
                    Router.push('/main');
                }
              else {
                Router.push('/register')
              }
            } else {
              Router.push('/register');
            }
          };
    

    return (
        <>
        <div className={styles.all}>
            <div className={styles.part1}>
                <h1>What is Chat-app?</h1>
                <br />
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum aut pariatur saepe debitis tempore hic excepturi. <br /> Itaque, numquam cumque consequatur quod nemo, odit corrupti, reiciendis tempore tenetur earum accusamus dignissimos.</p>
            </div>
    <div className={styles.part2}>
        <div className={styles.login}>
            <div className={styles.titling}>
            <h1 className={styles.title}>CHAT - APP</h1>
            </div>
            <hr className={styles.ligne}/>
            <label 
                htmlFor="username" 
                className={styles.labeling}>Username/Email :</label>
                <br />
        <input 
            type="text" 
            className={styles.inputing} 
            name="username"
            id="takename"
            placeholder="Put your username or password here..."/>
            <br />
            
            <label 
                htmlFor="password" 
                className={styles.labeling}>Password :</label>
                <br />
        <input 
            type="password"
            className={styles.inputing} 
            id="takepass"
            placeholder="Put your password here..." /> 
            <br />
            <hr className={styles.ligne2}/>
        <div className={styles.contain}>
            <button type='button' className={styles.tolog} onClick={login}>Login</button>
            <button type='button' className={styles.tolog} onClick={() => {Router.push("/register")}}>Register</button>
        </div>
        </div>
        <hr />
        <div className={styles.footer}>
            <h1>2000</h1>
        </div>
    </div>
        </div>
        </>
    )*/
    return (
        <>
        <div className="login">
            <form action="">
                <input type="text"  id="username" placeholder="username" />
                <input type="password"  id="password" placeholder="password" />
                <button>Login</button>
            </form>
        </div>
        </>
    )
}