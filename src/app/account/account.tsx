"use client";
import { getCookie } from "typescript-cookie";
import StatusUpdate from "./statusUpdate";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";

export default function Accounts() {

    const [userLogged, setUserLogged] = useState<string | null>(null);

    useEffect(()=>{
        const userCookie = getCookie("isLogged") || null;
        setUserLogged(userCookie)
    },[]);

    const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

    const { data } = useSWR("http://127.0.0.1:8090/api/collections/accounts/records/", fetcher, { revalidateOnFocus: false });

    const accounts = data?.items;

    const isOnline = accounts?.find((acc:any) => acc?.username === userLogged)?.isOnline;

    const friends = accounts?.find((acc:any) => acc?.username === userLogged)?.friends;
    const friendRequests = accounts?.find((acc:any) => acc?.username === userLogged)?.friend_requests;

    return (
        <>
            <h1>User page</h1>
            <h2>Welcome {userLogged}!</h2>
            <h2>Acitivity: {isOnline ? 'online': 'offline'}</h2>
            <h2><Link href={"/account/friends"}>{friends?.length} friends</Link></h2>
            <h2><Link href={"/account/friend-requests"}>{friendRequests?.length} friend requests</Link></h2>
            <h2>Post</h2>
            <StatusUpdate userLogged={userLogged} user={accounts}/>

        </>
    );
}
