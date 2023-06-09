export type Profile = {
    name:string
    currentPassword:string
    newPassword:string
    confirmPassword:string
    bio:string
    email:string
}
export type ProfileComplete = {
    name:string
    oldPassword:string
    password:string
    bio:string
    email:string
}