import * as yup from "yup";

export const schema = yup.object({
    email: yup.
            string().
            email("Incorrect Format").
            required("Email is mandatory"),
    password: yup.
                string().
                required("Password is mandatory"),
    name: yup.
            string().
            required("Name is mandatory"),
    bio: yup.
            string().
            required("Bio is maybe mandatory")
})