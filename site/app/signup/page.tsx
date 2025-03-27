"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useActionState } from "react";

import { signup } from "../actions/auth";

import { title } from "@/components/primitives";

export default function SignUp() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center">
        <span className={title()}>Sign Up</span>
      </div>
      <Form
        action={action}
        className="w-full max-w-xs flex flex-col items-center justify-center gap-4"
      >
        <Input id="name" label="Name" labelPlacement="inside" name="name" />
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <Input label="Email" labelPlacement="inside" name="email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <Input
          label="Password"
          labelPlacement="inside"
          name="password"
          type="password"
        />
        {state?.errors?.password && <p>{state.errors.password}</p>}

        <Button disabled={pending} type="submit">
          Sign Up
        </Button>
      </Form>
    </section>
  );
}
