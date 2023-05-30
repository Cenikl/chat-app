import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import {Login}  from "../typings/loginType";
import {Register} from '@/typings/signupType';
import { Profile } from '@/typings/editProfileType';
import { messageContent } from '@/typings/sendMessage';
import { Channel } from '@/typings/channelType';

export const handleformLogin = (yupSchema:any) => {
    return useForm<Login>({
        resolver: yupResolver(yupSchema)
    });
}

export const handleformRegister = (yupSchema:any) => {
    return useForm<Register>({
        resolver: yupResolver(yupSchema)
    });
}

export const handleformProfile = (yupSchema:any) => {
    return useForm<Profile>({
        resolver: yupResolver(yupSchema)
    });
}

export const handleformMessages = (yupSchema:any) => {
    return useForm<messageContent>({
        resolver: yupResolver(yupSchema)
    });
}
export const handleformChannel = (yupSchema:any) => {
    return useForm<Channel>({
        resolver: yupResolver(yupSchema)
    });
}