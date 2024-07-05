"use client";
import { getCookie } from "typescript-cookie";
import StatusUpdate from "./statusUpdate";
import Link from "next/link";
import useSWR from "swr";

export default function Accounts() {

    const user = getCookie("isLogged");

    const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

    const { data } = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false });

    const accounts = data?.items || [];

    const isOnline = accounts?.find((acc:any) => acc?.username === user)?.isOnline;

    const friends = accounts?.find((acc:any) => acc?.username === user)?.friends;
    const friendRequests = accounts?.find((acc:any) => acc?.username === user)?.friend_requests;

    return (
        <>
            <h1>User page</h1>
            <h2>Welcome {user}!</h2>
            <h2>Acitivity: {isOnline ? 'online': 'offline'}</h2>
            <h2><Link href={"/account/friends"}>{friends?.length} friends</Link></h2>
            <h2><Link href={"/account/friend-requests"}>{friendRequests?.length} friend requests</Link></h2>
            <h2>Post</h2>
            <StatusUpdate user={user} userInfo={accounts}/>

        </>
    );
}
