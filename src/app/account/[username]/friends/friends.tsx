"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { getCookie } from "typescript-cookie";

export default function friends() {

    const loggedUser = getCookie('isLogged');

    const username = useParams().username; 

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const userData = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

    const allUser = userData?.items;

    const user = allUser?.map((user:any)=> user)?.reverse();
    
    const filteredUser = user?.find((user:any)=> user?.username === username);

    const friends = filteredUser?.friends || [];

    const foundFriends = friends?.map((friendId:any)=>
        user?.find((user:any)=>user?.id === friendId)
    );
    
    return (
        <>
            <h2>{username}'s friends: </h2>
            <ul>
                {
                    foundFriends?.map((friends:any)=> {
                        const friendUsername = friends?.username;
                        const you = friendUsername === loggedUser ? "(You)" : ""; 
                        return(
                            <li key={friends?.id}>
                                <Link href={ you ? "/account" : `/account/${friendUsername}`}>{friendUsername}{you}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
