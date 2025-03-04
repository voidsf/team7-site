"use server"

import { SignupFormValidation } from "../lib/definitions"
import { FormState } from "../lib/definitions"

export async function signup(state: FormState, formData: FormData) {
    const validFields = SignupFormValidation.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validFields.success){
        return {
            errors: validFields.error.flatten().fieldErrors
        }
    }

    // create user
}