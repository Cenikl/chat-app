import {postRequest} from "../helpers/requests";
import {redirectTo} from "../helpers/redirect";
import {setToken} from "../helpers/cookie"
import { registerComplete } from "@/typings/signupType";

export const handleRegister = async (dataForm:any) => {
    if(dataForm.password == dataForm.confirmPassword ){
        const register : registerComplete = {
            name:dataForm.name,
            email:dataForm.email,
            password:dataForm.password
        }
        const response = await postRequest('http://localhost:8080/users',register);
            if(response.status == false){
                alert(response.message)
            }
            else{
                setToken('jwttoken',response.user.token)
                redirectTo('/profile')
    }
    }else 
        alert("Password don't match");
        
}