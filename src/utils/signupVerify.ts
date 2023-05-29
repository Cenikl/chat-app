import * as yup from "yup";

export const schema = yup.object({
        name: yup.
                string().
                required("Name is mandatory"),    
        email: yup.
                string().
                email("Incorrect Format").
                required("Email is mandatory"),
        password: yup.
                string().
                required("Password is mandatory"),
        confirmPassword:yup.
                string().
                required("Confirm your password"),

})