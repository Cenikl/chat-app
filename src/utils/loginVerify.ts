import * as yup from "yup";

export const schema = yup.object({
    email: yup.string().email("Incorrect Format").required("Email is mandatory"),
    password: yup.string().required("Password is mandatory")

})