"use client";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";
import useSWR from "swr";
import Link from "next/link";

export default function friendsList() {

    const [username, setUsername] = useState<string | null>(null);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const userData = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

    const allUser = userData?.items;

    const user = allUser?.map((user:any)=> user)?.reverse();

    useEffect(()=>{
        const user  = getCookie('isLogged') || null;
        setUsername(user);
    },[])

    const filteredUser = user?.find((user: any) => user?.username === username);

    const friends = filteredUser?.friends || [];

    const foundFriends = friends.map((friendId: any) => 
        user?.find((user: any) => user.id === friendId)
    );

    const handleUnfriend = (userId:any) =>{
        console.log(userId);
    }

    return (
        <>
            <h1>Friends</h1>
            <ul>
                {
                    foundFriends?.map((friends:any,)=>{

                        const friendUsername = friends?.username;

                        return (
                            <li key={friends?.id}>
                                <Link href={`/account/${friendUsername}`}>{friends?.username}</Link>
                                <button onClick={()=> handleUnfriend(friends?.id)}>Unfriend</button>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
