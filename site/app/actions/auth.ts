/** 
 * auth.ts
 * Contains server actions related to user authentication, including 
 * signup, login, and logout functionalities.
 */

"use server";

import type { FormState } from "@/app/lib/definitions";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import { createUser, getUserHash } from "@/database/database";
import { createSession, deleteSession } from "@/app/lib/session";
import { SignupFormValidation } from "@/app/lib/definitions";

/**
 * This function creates a new user in the database, and logs the user into 
 * this new account. 
 * If anything goes wrong in the signup process, an error is returned with an
 * appropriate error message.
 * @param _ A FormState object representing the previous state of the form. 
 * This argument is unused. 
 * 
 * @param formData A FormData object containing the form data submitted by the 
 * user. This includes the user's name, email, and password.
 * 
 * @returns A Promise that resolves to a FormState object. This object contains
 * any errors that occurred during the signup process. If the signup is
 * successful, the user is redirected to the dashboard.
 */
export async function signup(
  _: FormState,
  formData: FormData,
): Promise<FormState> {

  // Validates the form data using the SignupFormValidation schema.
  const validFields = SignupFormValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If the validation fails, return the errors.
  // This handles individual field errors, such as a missing email
  if (!validFields.success) {
    return {
      errors: validFields.error.flatten().fieldErrors,
    };
  }

  // Unpacks the validated data
  const { name, email, password } = validFields.data;

  // Hashes the password using bcrypt for security
  const hash = await bcrypt.hash(password, 10);

  // Attempts to create a record for the user in the database
  const status = await createUser("database.db", {
    name: name,
    email: email,
    pass: hash,
  });

  switch (status.code) {
    case 0:
      await createSession(email);
      redirect("/dashboard");
    case 2:
      return { errors: { email: ["A user with this email already exists"] } };
    default:
      console.log(status.code);

      return { errors: { email: ["An error occurred"] } };
  }
}

/**
 * This function handles the login process for a user. It checks if the provided
 * email and password are valid, and if they are, it creates a session for the
 * user and redirects them to the dashboard. If there are any errors, it returns
 * an object containing the errors.
 * @param _ A FormState object representing the previous state of the form.
 * This argument is unused.
 * @param formData A FormData object containing the form data submitted by the 
 * user. This includes the user's email and password.
 * @returns A FormState object containing any errors that occurred during the 
 * login process. If the login is successful, the user is redirected to the 
 * dashboard. 
 */
export async function login(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email")?.toString();
  const pass = formData.get("password")?.toString();

  if (!email || !pass) {
    return {
      errors: {
        email: ["Email is required"],
        password: ["Password is required"],
      },
    };
  }

  const hash = await bcrypt.hash(pass, 10);

  // check user
  const hash_status = await getUserHash("database.db", email);

  if (hash_status.status.code != 0) {
    return { errors: { email: ["User not found"] } };
  }

  if (hash_status.hash != null) {
    const match = await bcrypt.compare(pass, hash_status.hash);

    if (match) {
      await createSession(email);
      redirect("/dashboard");
    } else {
      return { errors: { password: ["Incorrect password"] } };
    }
  } else {
    return { errors: { email: ["User not found"] } };
  }
}

/**
 * This function handles the logout process for a user. It deletes the user's
 * session and redirects them to the login page.
 */
export async function logout() {
  await deleteSession();
  redirect("/login");
}