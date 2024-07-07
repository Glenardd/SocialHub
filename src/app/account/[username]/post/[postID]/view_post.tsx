"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import useSWR, { mutate } from 'swr'
import { useState, useEffect } from 'react';
import { getCookie } from 'typescript-cookie';
import Link from 'next/link';

export default function view_post() {

  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(()=>{
    const userCookie = getCookie("isLogged") || null;
    setUserLogged(userCookie);
  },[]);
  
  const params = useParams();
  const postId = params.postID;

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());
  
  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;
  const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

  const postData = post?.items;
  const user = accounts?.items;

  const foundPost = postData?.find((post:any)=> post?.id === postId);
  const postTextMessage = foundPost?.text_message;
  
  const postOwnerId = foundPost?.user;
  const postCreated = foundPost?.created;
  
  const postLikes = foundPost?.user_likes?.length;
  const postDislikes = foundPost?.user_dislikes?.length;

  const usersWhoLike = foundPost?.user_likes;
  const usersWhoDislike = foundPost?.user_dislikes;

  //the username of the post user
  const accountOwner = user?.find((acc:any)=> acc?.id === postOwnerId)?.username;

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

  //the id of the logged user
  const loggedUserId = user?.find((acc:any)=> acc?.username === userLogged)?.id ;

  //likes
  const handleLikes = async (postId:any) =>{

    const hasLiked = () =>{

      //find if user is in the userWhoLike
      const foundUser = usersWhoLike?.includes(loggedUserId);

      //if user is in the user_likes remove it if clicked again
      if(foundUser){
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
    }

    try{
      const like = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
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
          const removeFromDislike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
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

    const hasDisliked = () =>{

      //find if user is in the userWhoDislike
      const foundUser = usersWhoDislike?.includes(loggedUserId);

      //if user is in the user_dislikes remove it if clicked again
      if(foundUser){
        const removeLikeUser = usersWhoDislike?.filter((userId:any)=> userId !== loggedUserId);
        return removeLikeUser;

      //add the logged user if still not inside the user_dislikes
      }else{
        const addDislikeUser = [...usersWhoDislike, loggedUserId];
        return addDislikeUser;
      };

    };

    const dislikeData = {
      "user_dislikes": hasDisliked(),
    }

    try{
      const like = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dislikeData),
      });

      if(like.ok){
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
          };

        }catch(error){
          console.log(error);
        };
      };

    }catch(error){
      console.log(error);
    };

  };

  const loggedUser = accountOwner === userLogged ? "(You)" : "";

  return (
    <>
      <h2><Link href={loggedUser ? "/account": `/account/${accountOwner}`}>{accountOwner}{loggedUser}</Link></h2>
      <h2>Posted: {formatCreatedTime(postCreated)}</h2>
      <h2>{postTextMessage}</h2>
      <h2>Likes: {postLikes} Dislikes: {postDislikes}</h2>
      <button onClick={()=> handleLikes(postId)}>liked</button>
      <button onClick={()=> handleDislikes(postId)}>dislike</button>

    </>
  )
}
