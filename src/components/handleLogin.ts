import {postRequest} from "../helpers/requests";
import {redirectTo} from "../helpers/redirect";
import {setToken} from "../helpers/cookie"
import { Login } from "@/typings/loginType";

export const handleLogin = async (dataForm:any) => {
    const response = await postRequest('http://localhost:8080/users/login',dataForm);
        if(response.status == true){
            setToken('jwttoken',response.user.token)
            redirectTo('/main')
        }
        else {
            alert(response.message)
        }
    return response.status
}