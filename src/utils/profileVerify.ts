import * as yup from "yup";

export const schema = yup.object({
    name: yup.
            string().
            required("Name is mandatory"),
    currentPassword: yup.
                    string().
                    required("Password is mandatory"),
    newPassword:yup.
                string().
                required("Password is mandatory"),
    confirmPassword:yup.
                string().
                required("Password is mandatory"),
    bio: yup.
            string().
            required("Bio is maybe mandatory")
})