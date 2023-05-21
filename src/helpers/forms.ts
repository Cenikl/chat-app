import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import {Login}  from "../typings/loginType";
import { Type } from 'typescript';

export const handleformLogin = (yupSchema:any) => {
    return useForm<Login>({resolver: yupResolver(yupSchema)});
}