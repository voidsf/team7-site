import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/app/lib/session";

export default async function Dashboard() {

    const cookie = await cookies();
    const session = cookie.get("session");

    if (session === undefined) {
        redirect("/login");
        return;
    }
    const user = await decrypt(session.value);

    return (
        <>
        <h1>Dashboard</h1>

        <p>Welcome to your dashboard, {JSON.stringify(user)}</p>
        
        </>
    )

}