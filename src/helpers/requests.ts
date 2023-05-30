export const postRequest = async (url:string,data:any) => {
    const request = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        })
    return await request.json();
}

export const sendwithBodyRequest = async (url:string,method:string,data:any,token:any) => {
    const request = await fetch(url,{
            method: method,
            body: JSON.stringify(data),
            headers:{
                'Authorization' : 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        })
    return request;
}

 export const getWithToken = async (url:string,token:any) => {
    const request = await fetch(url,{
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        })
    return request;
}