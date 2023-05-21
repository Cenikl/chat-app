import * as yup from "yup";

export const schema = yup.object({
    name: yup.string().required("Put the name of the channel"),
    type: yup.string().required("Type is mandatory"),
    members: yup.string().notRequired()
})