"use client";

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useActionState } from "react";

import { login } from "../actions/auth";

import { title } from "@/components/primitives";

export default function Login() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center">
        <span className={title()}>Login</span>
      </div>
      <Form
        action={action}
        className="w-full max-w-xs flex flex-col items-center justify-center gap-4"
      >
        <Input id="email" label="Email" labelPlacement="inside" name="email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <Input
          id="password"
          label="Password"
          labelPlacement="inside"
          name="password"
          type="password"
        />
        <Button disabled={pending} type="submit">
          Log In
        </Button>
        {state?.errors?.password && <p>{state.errors.password}</p>}
      </Form>
    </section>
  );
}
