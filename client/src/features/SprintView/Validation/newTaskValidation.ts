import * as yup from 'yup'

export const validationSchema = yup.object().shape({
    name: yup.string().required('*Name required'),
    description: yup.string().required('*Description required'),
    effort: yup.number(),
})