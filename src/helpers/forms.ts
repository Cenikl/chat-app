import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import {Login}  from "../typings/loginType";
import {Register} from '@/typings/signupType';

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