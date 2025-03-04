"use client"

import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { signup } from "../actions/auth";
import { useActionState } from "react";

export default function SignUp() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center">
        <span className={title()}>Sign Up</span>
      </div>
      <Form action={action} className="w-full max-w-xs flex flex-col items-center justify-center gap-4">
        <Input id="name" name="name" label="Name" labelPlacement="inside" />
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <Input name="email" label="Email" labelPlacement="inside" />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <Input name="password" label="Password" labelPlacement="inside" type="password" />
        {state?.errors?.password && <p>{state.errors.password}</p>}

        <Button disabled={pending} type="submit">Sign Up</Button>
      </Form>
    </section>
  );
}