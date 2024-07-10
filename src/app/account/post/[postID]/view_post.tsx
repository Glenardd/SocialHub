"use client";
import { useParams } from "next/navigation"
import useSWR, {mutate} from "swr";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";

export default function view_post() {

  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(()=>{
    const userCookie = getCookie("isLogged") || null;
    setUserLogged(userCookie);
  },[]);

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;
  const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

  //get the accounts
  const user = accounts?.items;

  //get the post
  const postData = post?.items;

  const params = useParams();

  //post id params
  const postId = params.postID;

  //find that post id
  const foundPost = postData?.find((post:any)=> post?.id === postId);

  const postTextMessage = foundPost?.text_message;
  
  const currentLoggedUserID = foundPost?.user;
  const postCreated = foundPost?.created;
  
  const usersWhoLikeNum = foundPost?.user_likes?.length;
  const usersWhoDislikeNum = foundPost?.user_dislikes?.length;

  const usersWhoLike = foundPost?.user_likes;
  const usersWhoDislike = foundPost?.user_dislikes;

  //get the username of the post user
  const currentLoggedUserUsername = user?.find((acc:any)=>acc?.id === currentLoggedUserID)?.username;

  //time format
  const formatCreatedTime = (created: string) => {
    const date = new Date(created);
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;

    let createdTime = '';

    if (diffInSeconds < 60) {
        createdTime = 'Just now';
    } else if (diffInMinutes < 60) {
        const minutes = Math.floor(diffInMinutes);
        createdTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        createdTime = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
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

  //likes
  const handleLikes = async (postId: any) => {
    //checks if the current user already like the post
    const hasLiked = () =>{ 
        //checks if user is in user_likes
        const checkUser = usersWhoLike?.includes(currentLoggedUserID);

        //if the user is inside the user_likes remove it when clicked again
        if(checkUser){
            const removeLikeUser = usersWhoLike?.filter((userId:any)=> userId !== currentLoggedUserID);
            
            return removeLikeUser;
        //add the logged user if still not inside the user_likes
        }else{
            const addLikeUser = [...usersWhoLike, currentLoggedUserID];
            
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
            const removeUser = usersWhoDislike?.filter((userId:any)=> userId !== currentLoggedUserID);

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

  //dislikes
  const handleDislikes = async (postId:any) =>{
    //checks if the current user already like the post
    const hasDisliked = () =>{ 
        //checks if user is in user_likes
        const checkUser = usersWhoDislike?.includes(currentLoggedUserID);

        //if the user is inside the user_likes remove it when clicked again
        if(checkUser){
            const removeDislikeUser = usersWhoDislike?.filter((userId:any)=> userId !== currentLoggedUserID);
            
            return removeDislikeUser;
        //add the logged user if still not inside the user_likes
        }else{
            const addLikeUser = [...usersWhoLike, currentLoggedUserID];
            
            return addLikeUser;
        };
    };

    const likeData = {
        "user_dislikes": hasDisliked(),
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
            const removeUser = usersWhoLike?.filter((userId:any)=> userId !== currentLoggedUserID);

            const dislikeData = {
                "user_likes": removeUser,
            };

            try{
                const removeFromLike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`,{
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dislikeData),
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
  };


  const loggedUser = currentLoggedUserUsername === userLogged ? "(You)" : "";

  return (
    <>
      <h2><Link href={loggedUser ? "/account":""}>{currentLoggedUserUsername}{loggedUser}</Link></h2>
      <h2>Posted: {formatCreatedTime(postCreated)}</h2>
      <h2>{postTextMessage}</h2>
      <h2>Likes: {usersWhoLikeNum} Dislikes: {usersWhoDislikeNum}</h2>
      <button onClick={()=> handleLikes(postId)}>like</button>
      <button onClick={()=> handleDislikes(postId)}>dislike</button>
    </>
  )
}
