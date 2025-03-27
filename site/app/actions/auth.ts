"use server";

import { createUser, getUserHash } from "@/database/database";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import { SignupFormValidation } from "../lib/definitions";
import { FormState } from "../lib/definitions";
import { createSession } from "../lib/session";

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
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

  const { name, email, password } = validFields.data;

  const hash = await bcrypt.hash(password, 10);

  // create user
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

export async function login(
  state: FormState,
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
