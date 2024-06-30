"use client";
import useSWR, {mutate} from "swr";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";

export default function pages() {

    const [userLogged, setUserLogged] = useState<string | null>(null);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());
    
    const userAccount = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false})?.data;

    const userData = userAccount?.items;

    const user = userData?.map((acc:any)=>acc).reverse();

    useEffect(()=>{
        const user  = getCookie('isLogged') || null;
        setUserLogged(user);
    },[]);

    const loggedUser = user?.find((acc:any)=> acc?.username === userLogged);

    const friendRequests = loggedUser?.friend_requests; 

    const foundRequests = friendRequests?.map((id:any)=>{
        return user?.find((acc:any)=> acc?.id === id)?.username;
    })
    
    const handleConfirm = async (username: any) =>{

        const userLogegdId = loggedUser?.id;
        const userLoggedFriends =  loggedUser?.friends;

        const userfind = user?.find((acc:any)=> acc?.username === username)?.id; 

        const updateFriends = [...userLoggedFriends, userfind];

        const friends ={
            "friends": updateFriends,
        };

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userLogegdId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(friends),
            });

            if(response.ok){
                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
            }
        }catch(error){
            console.log(error);
        }
    
    };
    
    return (
        <>
        <h1>Friend Requests:</h1>
        <ul>
        {
            foundRequests?.map((username:any, id:number)=>{
                return(
                    <li key={id}>
                        <Link href={`/account/${username}`}>{username}</Link>
                        <button onClick={()=>handleConfirm(username)}>Confirm</button>
                        <button >Delete</button>
                    </li>
                )
            }).reverse()
        }
        </ul>
        </>
    )
}
