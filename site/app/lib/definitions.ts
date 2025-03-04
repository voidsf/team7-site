import { z } from "zod";

export const SignupFormValidation = z.object({
    name: z
        .string()
        .min(2, {message: "Name must be at least 2 characters long"})
        .trim(),
    email: z
        .string()
        .email({message:"Please enter a valid email"}),
    password: z
        .string()
        .min(8, {message:"Password must be at least 8 characters long "})
        .trim()
})

export type FormState = {
    errors?: {
        name?: string[],
        email?: string[],
        password?: string[]
    }
    message?: string
} | undefined