import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { title } from "@/components/primitives";

export default function Login() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center">
        <span className={title()}>Login</span>
      </div>
      <Form className="w-full max-w-xs flex flex-col items-center justify-center gap-4">
        <Input label="Username" labelPlacement="inside" />
        <Input label="Password" labelPlacement="inside" type="password" />
        <Button type="submit">Log In</Button>
      </Form>
      </section>
  );
  
}
