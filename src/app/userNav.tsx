"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Search from "./search";
import UserNotification from "./userNotification";
import { getCookie, removeCookie } from "typescript-cookie";
import { useRouter } from "next/navigation";
import useSWR, {mutate} from "swr";

export default function UserNav() {
  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(() => {
    // Access cookies only on the client side
    const user = getCookie("isLogged") || null;
    setUserLogged(user);
  }, []);

  const router = useRouter();

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

  const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

  const user = accounts?.items;

  const posts = post?.items;

  //data of the logged user
  const loggedUser = user?.find((acc:any)=> acc?.username === userLogged);
  //id of the logged user
  const loggedUserId = loggedUser?.id

  const handleLogout = async () => {

    //when logged out isOnline should be false
    const isOnline = {
      "isOnline": false,
    };

    try{
      const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${loggedUserId}`,{
        method: "PATCH",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(isOnline),
      });

      if(response.ok){
        mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
      }
    }catch(error){
      console.log(error);
    }

    removeCookie("isLogged");
    router.push("/");

  };

  const handleDeleteAcc = async () => {
  };

  return (
    <>
      <Link href="/home">home</Link>
      <Link href="/account">{userLogged}</Link>
      <button onClick={handleDeleteAcc}>Delete account</button>
      <button onClick={handleLogout}>Logout</button>
      <Search />
      <UserNotification posts={posts} loggedUserId={loggedUserId} user={user}/>
    </>
  );
}
