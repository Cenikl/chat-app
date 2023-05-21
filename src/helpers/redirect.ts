import Router from 'next/router';

export function redirectTo(url:string){
    return Router.push(url)
}