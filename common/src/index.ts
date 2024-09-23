import zod, { TypeOf } from 'zod'


//Backend will needd them
export const signupInput = zod.object({
    email:zod.string().email(),
    password:zod.string().min(6),
    name:zod.string().optional()
})

export const signinInput = zod.object({
    email:zod.string().email(),
    password: zod.string().min(6)
})

export const createBlogInput = zod.object({
    title:zod.string(),
    content:zod.string()
})

export const updateBlogInput = zod.object({
    title:zod.string(),
    content:zod.string(),
    id : zod.number()
})


//frontend will need them
//mosty used for frontend validations
export type SignupInput = zod.infer<typeof signupInput>
export type SigninInput = zod.infer<typeof signinInput>
export type CreateBlogInput = zod.infer<typeof createBlogInput>
export type UpdateBlogInput = zod.infer<typeof updateBlogInput>