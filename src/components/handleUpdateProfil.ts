import {sendwithBodyRequest} from "../helpers/requests";
import {getToken} from "../helpers/cookie"
import { ProfileComplete } from "@/typings/editProfileType";

export const handleProfile = async (data:any) => {
    const sendData : ProfileComplete = {
        name: data.name,
        oldPassword: data.currentPassword,
        password: data.newPassword,
        bio: data.bio
    } 
    return sendwithBodyRequest('http://localhost:8080/user','PUT',sendData,getToken('jwttoken'));
}