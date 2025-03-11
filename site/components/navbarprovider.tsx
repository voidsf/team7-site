"use server";
import React from "react";
import { cookies } from "next/headers";

import { Navbar } from "./navbar";

export async function NavbarProvider() {
  const cookie = await cookies();
  const session = cookie.get("session");

  return (
    <>
      <h1>{session?.value}</h1>
      <Navbar sessionStatus={!!session} />
    </>
  );
}
