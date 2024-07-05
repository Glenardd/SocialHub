import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { getCookie } from 'typescript-cookie';

export default function search() {

    const[userLogged, setUserLogged] = useState<string | null>(null);

    useEffect(()=>{
        const userCookie = getCookie("isLogged") || null;
        setUserLogged(userCookie);
    },[])

    const params = useSearchParams();

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    //acounts data
    const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

    //post data
    const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

    const user = accounts?.items;

    const userPosts = post?.items;

    const search = params.get('search');

    //formats the date
    const formatCreatedTime = (created: string) => {
        const date = new Date(created);
        const now = new Date();
        const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;
    
        let createdTime = '';
    
        if (diffInSeconds < 60) {
            createdTime = 'Just now';
        } else if (diffInMinutes < 60) {
            const minutes = Math.floor(diffInMinutes);
            createdTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            createdTime = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            const days = Math.floor(diffInDays);
            createdTime = `${days} day${days !== 1 ? 's' : ''} ago`;
        } else {
            const isDifferentYear = date.getFullYear() !== now.getFullYear();
            const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
            if (isDifferentYear) {
                options.year = 'numeric';
            }
            createdTime = date.toLocaleString('default', options);
        }
    
        return createdTime;
    };

    return (
        <>
            <h1>Search results of: {search}</h1>
            {/* username accounts listed here */}
            <h2>Users:</h2>
            <ul>
                {
                    user?.map((acc:any)=>{

                        //user username data
                        const username = acc?.username;

                        //search accounts that starts with a certain letter or a group of letter
                        const findAccounts = username?.toLowerCase().startsWith(search?.toLowerCase());

                        if(findAccounts){

                            //the person loggedin
                            const mainUserLogged = userLogged === username ? "(You)" : "";

                            //list of found account searched
                            return (
                                <>
                                    <li key={acc?.id}>
                                        <li><Link href={mainUserLogged ? "/account": `/account/${username}`}>{username}{mainUserLogged}</Link></li>
                                    </li>
                                </>
                            )
                        };

                    })
                }
                {
                    // Check if no users found
                    user?.filter((acc: any) => acc?.username?.toLowerCase().startsWith(search?.toLowerCase())).length === 0 &&
                    <div>No users found</div>
                }
            </ul>
            {/* user posts listed here */}
            <h2>Posts: </h2>
            <ul>
                {
                    userPosts?.map((post:any)=>{
                        
                        const text_message = post?.text_message;
                        const userOfTextMessageId = post?.user;
                        const timeOfPost = post?.created;

                        const findTextMessage = text_message?.toLowerCase().startsWith(search?.toLowerCase());

                        if(findTextMessage){ 

                            const usernameOfTextMessage = user?.find((acc:any)=> acc?.id === userOfTextMessageId)?.username;

                            const mainUserLogged = usernameOfTextMessage === userLogged ? "(You)" : ""; 

                            return(
                                <li>
                                    <li>
                                        <div><Link href={mainUserLogged ? "/account" : `/account/${usernameOfTextMessage}`}>{usernameOfTextMessage}{mainUserLogged}</Link></div>
                                        <div>Posted: {formatCreatedTime(timeOfPost)}</div>
                                        <div>{text_message}</div>
                                    </li>
                                </li>
                            );
                        }
                    })
                }
                {
                    // Check if no posts found
                    userPosts?.filter((post: any) => post?.text_message?.toLowerCase().startsWith(search?.toLowerCase())).length === 0 &&
                    <div>No posts found</div>
                }
            </ul>
        </>
    )
}
