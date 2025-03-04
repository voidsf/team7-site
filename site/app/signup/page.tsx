import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { signup } from "../actions/auth";

export default function SignUp() {

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center">
        <span className={title()}>Sign Up</span>
      </div>
      <Form action={signup} className="w-full max-w-xs flex flex-col items-center justify-center gap-4">
        <Input id="name" name="name" label="Name" labelPlacement="inside" />
        <Input name="email" label="Email" labelPlacement="inside" />
        <Input name="password" label="Password" labelPlacement="inside" type="password" />
        <Input
          name="confirmPassword"
          label="Confirm Password"
          labelPlacement="inside"
          type="password"
        />
        <Button type="submit">Log In</Button>
      </Form>
    </section>
  );
}