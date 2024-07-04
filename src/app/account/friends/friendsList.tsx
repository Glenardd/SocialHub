"use client";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";
import useSWR, { mutate } from "swr";
import Link from "next/link";

export default function friendsList() {
    
    const [userLogged, setUserLogged] = useState<string | null>(null);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const userData = useSWR("http://127.0.0.1:8090/api/collections/accounts/records/", fetcher, { revalidateOnFocus: false })?.data;

    const allUser = userData?.items;

    const user = allUser?.map((user:any)=> user)?.reverse();

    useEffect(()=>{
        const user  = getCookie("isLogged") || null;
        setUserLogged(user);
    },[])

    //data of the logged user
    const loggedUserData = user?.find((user: any) => user?.username === userLogged);
    //friends data of logged user
    const loggedUserFriends = loggedUserData?.friends
    //logged user id
    const loggedUserId = loggedUserData?.id;
    
    const friends = loggedUserFriends?.map((friendId: any) => 
        user?.find((user: any) => user.id === friendId)
    );

    const handleUnfriend = async (userId:any) =>{

        //filter the id that will be removed to the logged user friends
        const removedIdFromUserFriends = loggedUserFriends?.filter((id:any)=> id !== userId);

        //from the logged user friends
        const unfriendData = {
            "friends": removedIdFromUserFriends, 
        };

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${loggedUserId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(unfriendData),
            });
    
            if(response.ok){
                
                //get the friends data of the unfriended account
                const removeAccFriends = user?.find((acc:any)=> acc?.id === userId )?.friends;

                //check if the current logged user is friend with the unfriended account
                //and filter it
                const updatedRemoveAccFriends = removeAccFriends?.filter((friends:any)=> friends !== loggedUserId);

                const removedFriendData = {
                    "friends": updatedRemoveAccFriends,
                };

                try{
                    //update the unfriended account friends
                    const removeAccount = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body:JSON.stringify(removedFriendData),
                    });

                    if(removeAccount.ok){
                        mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
                    };

                }catch(error){
                    console.log(error);
                }
            };
        }catch(error){
            console.log(error);
        }

    };

    return (
        <>
            <h1>Friends</h1>
            <ul>
                {
                    friends?.map((friends:any,)=>{

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
