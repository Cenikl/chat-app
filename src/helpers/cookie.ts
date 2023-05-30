import Cookies from 'universal-cookie';

export const setToken = (tokenName:string,tokenValue:any) => {
    const cookies = new Cookies();
    return cookies.set(tokenName,tokenValue);
}

export const removeToken = (tokenName:string) => {
    const cookies = new Cookies();
    return cookies.remove(tokenName);
}

export const getToken = (tokenName:string) => {
    const cookies = new Cookies();
    return cookies.get(tokenName)
}