import * as yup from "yup";

export const schema = yup.object({
    name: yup.
            string().
            required("Name is mandatory"),
    oldPassword: yup.
                    string().
                    required("Password is mandatory"),
    password:yup.
                string().
                required("Password is mandatory"),
    bio: yup.
            string().
            required("Bio is maybe mandatory")
})