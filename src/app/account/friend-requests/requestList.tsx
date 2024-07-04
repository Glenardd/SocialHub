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
        const user  = getCookie("isLogged") || null;
        setUserLogged(user);
    },[]);

    //get the data of logged current user
    const loggedUser = user?.find((acc:any)=> acc?.username === userLogged);

    //get the id of the current user
    const userLoggedId = loggedUser?.id;

    //get the friend requests of the current user
    const friendRequests = loggedUser?.friend_requests; 

    // get the friends of the current user
    const userLoggedFriends =  loggedUser?.friends;

    const foundRequests = friendRequests?.map((id:any)=>{
        return user?.find((acc:any)=> acc?.id === id)?.username;
    })
    
    const handleConfirm = async (username: any) =>{

        const userfind = user?.find((acc:any)=> acc?.username === username)?.id; 

        const updateFriends = [...userLoggedFriends, userfind];

        const friends ={
            "friends": updateFriends,
        };

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userLoggedId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(friends),
            });

            if(response.ok){
                
                //filter the unfriended account
                const removeAccount = friendRequests?.filter((user:any)=> user !== userfind);
                
                //find the removed user account
                const otherUser = user?.find((acc:any)=> acc?.id === userfind);

                //get the other user friends
                const otherUserFriends = otherUser?.friends;

                //appened the currentt user loggedin in the other user friends list
                // both can now be friends
                const updatedUsersFriends = [...otherUserFriends, userLoggedId];

                const  addTofriendData ={
                    "friends": updatedUsersFriends, 
                };

                try{
                    const addToFriendConfirm = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userfind}`,{
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(addTofriendData),
                    });
    
                    if(addToFriendConfirm.ok){

                        //removed accounts in the friend requests after comfirming as friends
                        const removeAccountData = {
                            "friend_requests": removeAccount, 
                        };
                        
                        try{
                            const removeRequest = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userLoggedId}`,{
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(removeAccountData),
                            });

                            if(removeRequest.ok){
                                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
                            };
                        }catch(error){

                        };
                    };
                }catch(error){
                    console.log(error)
                };                  
            };
        }catch(error){
            console.log(error);
        };
    
    };

    const handleDelete = async (username:any) =>{
        
        const userfind = user?.find((acc:any)=> acc?.username === username)?.id;

        const removeAccountRequest = friendRequests?.filter((user:any)=> user !== userfind); 

        const removeRequest = {
            "friend_requests": removeAccountRequest,
        };
        
        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userLoggedId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(removeRequest),
            });
            
            if(response.ok){
                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
            };

        }catch(error){
            console.log(error);
        };
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
                        <button onClick={()=>handleDelete(username)}>Delete</button>
                    </li>
                )
            }).reverse()
        }
        </ul>
        </>
    )
}
