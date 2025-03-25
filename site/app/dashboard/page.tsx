"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserDetails, getAllUserDevices } from "database";
import { decrypt, SessionJWTPayload } from "@/app/lib/session";
import DeviceDetails from "@/components/devicedetails";

export default async function Dashboard() {
  const cookie = await cookies();
  const session = cookie.get("session");

  if (!session) {
    redirect("/login");
  }
  const user = await decrypt(session.value);
  
  if (!user || user.expires < new Date()) {
    cookie.delete("session");
    redirect("/login");
  }

  const userDetails = await getUserDetails("database.db", user.email);

  if (userDetails.status.code != 0 || !userDetails.details) {
    cookie.delete("session");
    redirect("/login");
  }  

  const { name } = userDetails.details;



  return (
    <>
      <h1>Dashboard</h1>

      <p>Welcome to your dashboard, {name}</p>
      <DeviceDetails email={user.email}/>
      {/*<p>Contents of session: {JSON.stringify(user)}</p>*/}
    </>
  );
}
