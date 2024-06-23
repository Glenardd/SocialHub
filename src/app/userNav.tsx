"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Search from "./search";
import { getCookie } from "typescript-cookie";

export default function UserNav() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Access cookies only on the client side
    const userCookie = getCookie("isLogged") || null;
    setUser(userCookie);
  }, []);

  return (
    <>
      <Link href="/home">home</Link>
      <Link href="/account">{user}</Link>
      <Search />
    </>
  );
}
