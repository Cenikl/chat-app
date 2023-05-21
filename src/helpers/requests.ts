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