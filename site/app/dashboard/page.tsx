import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserDetails } from "database";
import { decrypt, SessionJWTPayload } from "@/app/lib/session";

export default async function Dashboard() {
  const cookie = await cookies();
  const session = cookie.get("session");

  if (!session) {
    redirect("/login");
  }
  const user = await decrypt(session.value);
  
  if (!user) {
    cookie.delete("session");
    redirect("/login");
  }

  const userDetails = await getUserDetails("database.db", user.email);
  if (userDetails.status.code != 0 || !userDetails.details) {
    cookie.delete("session");
    redirect("/login");
  }  

  const { name, email } = userDetails.details;

  return (
    <>
      <h1>Dashboard</h1>

      <p>Welcome to your dashboard, {name}</p>
    </>
  );
}
