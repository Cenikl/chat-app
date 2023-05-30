export const checkToken = (context:any) => {
    const {req} = context;
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader ? cookieHeader?.split('; ')
        .find((cookie:any) => cookie.trim().startsWith('jwttoken='))
        ?.split('=')[1]
        : null; 
    if(token == null){
        return{
            redirect: {
                destination: '/login',
                permanent:false
            }
        };
    }
    else
        return token
    
}