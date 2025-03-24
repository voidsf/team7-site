import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/lib/session";

export default async function Dashboard() {
  const cookie = await cookies();
  const session = cookie.get("session");

  if (!session) {
    redirect("/login");
  }
  const user = await decrypt(session.value);

  if (!user) {
    // return an error or something about failure to verify
    cookie.delete("session");
  }
  const email = user.email;

  const userDetails = await getUserDetails("database.db", email);


  

  return (
    <>
      <h1>Dashboard</h1>

      <p>Welcome to your dashboard, {JSON.stringify(user)}</p>
    </>
  );
}
