"use server";

import { createUser, DatabaseRequestStatus } from "database";

import { SignupFormValidation } from "../lib/definitions";
import { FormState } from "../lib/definitions";


export async function signup(state: FormState, formData: FormData) : Promise<FormState>{
  const validFields = SignupFormValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validFields.success) {
    return {
      errors: validFields.error.flatten().fieldErrors,
    };
  }

  // create user
  const status: DatabaseRequestStatus = await createUser("database.db", {
    name: validFields.data.name,
    email: validFields.data.email,
    pass: validFields.data.password,
  });

  switch (status.code) {
    case 0: 
      return;
    case 2:
      return { errors: { email: ["A user with this email already exists"] } };
    default: 
      return { errors: { email: ["An error occurred"] } };
  };

  

}
