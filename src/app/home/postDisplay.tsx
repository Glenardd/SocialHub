"use client";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { getCookie } from "typescript-cookie";
import { useEffect, useState } from "react";

export default function postDisplay() {

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const postData = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

    const userData = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

    const allPost = postData?.items;
    const allUser = userData?.items;

    const post = allPost?.map((post: any) => post)?.reverse();
    const user = allUser?.map((user: any) => user)?.reverse();

    const [userLogged, setUserLogged] = useState<string | null>(null);

    useEffect(()=>{
        const userCookie = getCookie("isLogged") || null;
        setUserLogged(userCookie);
    },[]);

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

    const loggedUserId = user?.find((acc:any)=> acc?.username === userLogged)?.id;

    const handleLikes = async (postId:any) =>{
        const foundPost = post?.find((post:any)=> post?.id === postId);

        const usersWhoLike = foundPost?.user_likes;
        const usersWhoDislike = foundPost?.user_dislikes;

        const checkUser = usersWhoLike?.includes(loggedUserId);

        const hasLiked = () =>{
            //if the user is inside the user_likes remove it when clicked again
            if(checkUser){
                const removeLikeUser = usersWhoLike?.filter((userId:any)=> userId !== loggedUserId);
                
                return removeLikeUser;
            //add the logged user if still not inside the user_likes
            }else{
                const addLikeUser = [...usersWhoLike, loggedUserId];
                return addLikeUser;
            };
        };

        const likeData = {
            "user_likes": hasLiked(),
        };

        try{
            const like = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(likeData),
            });

            if(like.ok){
                const removeUser = usersWhoDislike?.filter((userId:any)=> userId !== loggedUserId);

                const dislikeData = {
                    "user_dislikes": removeUser,
                };

                try{
                    const removeFromDislike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`,{
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dislikeData),
                    });

                    if(removeFromDislike.ok){
                        mutate("http://127.0.0.1:8090/api/collections/status_update/records");
                    }
                }catch(error){
                    console.log(error);
                };
            };

        }catch(error){
            console.log(error);
        };
    };

    const handleDislikes = async (postId:any) =>{
        const foundPost = post?.find((post:any)=> post?.id === postId);

        const usersWhoLike = foundPost?.user_likes;
        const usersWhoDislike = foundPost?.user_dislikes;

        const checkUser = usersWhoDislike?.includes(loggedUserId);

        const hasDisliked = () =>{
            //if the user is inside the user_dislike remove it when clicked again
            if(checkUser){
                const removeDislikeUser = usersWhoDislike?.filter((userId:any)=> userId !== loggedUserId);
                
                return removeDislikeUser;
            //add the logged user if still not inside the user_dislikes
            }else{
                const addDislikeUser = [...usersWhoDislike, loggedUserId];
                return addDislikeUser;
            };
        };

        const dislikeData = {
            "user_dislikes": hasDisliked(),
        };

        try{
            const dislike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dislikeData),
            });

            if(dislike.ok){
                const removeUser = usersWhoLike?.filter((userId:any)=> userId !== loggedUserId);

                const likeData = {
                    "user_likes": removeUser,
                };

                try{
                    const removeFromLike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`,{
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(likeData),
                    });

                    if(removeFromLike.ok){
                        mutate("http://127.0.0.1:8090/api/collections/status_update/records");
                    }
                }catch(error){
                    console.log(error);
                };
            };

        }catch(error){
            console.log(error);
        };
    }

    return (
        <>
            <h1>Post display</h1>
            <ul>
                {
                    post?.map((post:any)=>{

                        const accounts = user?.find((user:any)=> user?.id === post?.user)?.username;

                        const postId = post?.id; 

                        return (
                            <li key={post?.id}>
                                <div><Link href={accounts === userLogged ? "/account" :`/account/${accounts}`}>{accounts}</Link></div>
                                <Link href={`/account/${accounts}/post/${postId}`}>
                                    <div>Posted: {formatCreatedTime(post?.created)}</div>
                                    <div>{post?.text_message}</div>
                                </Link>
                                <div>Likes: {post?.user_likes?.length} Dislikes: {post?.user_dislikes?.length}</div>
                                <button onClick={()=>handleLikes(post?.id)}>Like</button>
                                <button onClick={()=>handleDislikes(post?.id)}>Dislike</button>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
