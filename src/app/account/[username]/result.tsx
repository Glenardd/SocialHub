'use client';
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";

export default function result() {
    
    const username = useParams().username; 

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const status_update = useSWR('http://127.0.0.1:8090/api/collections/status_update/records/', fetcher, {revalidateOnFocus: false}).data;
    
    const userAccount = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false}).data;

    const post = status_update?.items;

    const reversedOrderPost = post?.map((post: any) => post)?.reverse();

    const user = userAccount?.items;
    
    const isOnline = user?.find((acc:any)=> acc?.username === username)?.isOnline;

    const userId = user?.find((acc:any)=> acc?.username === username)?.id;

    const [loggedUser, setLoggedUser] = useState<string | null>(null);

    //current logged user
    const currentLoggedUserID = user?.find((acc: any)=> acc?.username === loggedUser)?.id;

    //friends of the logged user
    const currentLoggedUserFriends = user?.find((acc: any)=> acc?.username === loggedUser)?.friends;

    //get the data of the added account
    const addedUser = user?.find((acc: any)=> acc?.id === userId);

    //get the friend request property
    const addedUserFriendRequest = addedUser?.friend_requests;

    //get the friends of the added account
    const addedUserFriends = addedUser?.friends;

    useEffect(()=>{
        const userLogged = getCookie("isLogged") || null;
        setLoggedUser(userLogged);
    },[])

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

    const handleLikes = async (postId: any) =>{

        const userPosts = post?.filter((post:any)=> post?.user === userId);

        const newPosts = userPosts?.map((post:any)=>{
            if(post?.id === postId){
                return {
                    ...post,
                    likes: post?.likes + 1,

                }
            }
            return post;
        });

        const likes = {
            "likes": newPosts.find((post: any) => post.id === postId)?.likes,
        }

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(likes),
            });

            if(response.ok){
                mutate(
                    "http://127.0.0.1:8090/api/collections/status_update/records/"
                );
            };
            
        }catch(error){
            console.log(error);
        }

    };

    const handleDislikes = async (postId: any) =>{
        const userPosts = post?.filter((post:any)=> post?.user === userId);

        const newPosts = userPosts?.map((post:any)=>{
            if(post?.id === postId){
                return {
                    ...post,
                    dislikes: post?.dislikes + 1,

                }
            };
            return post;
        });

        const dislikes = {
            "dislikes": newPosts.find((post: any) => post.id === postId)?.dislikes,
        }

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dislikes),
            });

            if(response.ok){
                mutate(
                    "http://127.0.0.1:8090/api/collections/status_update/records/"
                );
            };
            
        }catch(error){
            console.log(error);
        }
    }

    const handleAddFriend = async (userId:any) =>{

        //appened the loggedin account
        const updateAddedUser = [...addedUserFriendRequest, currentLoggedUserID];

        const friendRequest = {
            "friend_requests": updateAddedUser,
        };

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(friendRequest),
            });

            if(response.ok){
                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
            }
        }catch(error){
            console.log(error);
        }
    };

    const handleCancelFriend = async (userId:any) => {
        //appened the loggedin account
        const updateAddedUser = addedUserFriendRequest.filter((friendId:any) => friendId !== currentLoggedUserID);

        const unfriend = {
            "friend_requests": updateAddedUser,
        }

        try{
            const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(unfriend),
            });

            if(response.ok){
                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
            }
        }catch(error){
            console.log(error);
        }
    };

    const handleUnfriend = async (userId:any) =>{
        const removeAccount = currentLoggedUserFriends?.filter((id:any)=> id!== userId);

        const unfriend = {
            "friends": removeAccount,
        };

        const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${currentLoggedUserID}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(unfriend),
        });

        if(response.ok){
            const checkIfFriends = currentLoggedUserFriends?.filter((id:any)=> id !== userId )

            const checkFriendsData = {
                "friends": checkIfFriends,
            };
            const unfriendAcc = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(checkFriendsData),
            });

            if(unfriendAcc.ok){
                mutate("http://127.0.0.1:8090/api/collections/accounts/records/");
            };
       };
    };
    
    //find the friend_requests of the visited account
    const isFriendRequest = user?.find((acc:any)=> acc?.username === username)?.friend_requests;

    //find if the logged user are friends
    const isFriend = user?.find((acc:any)=> acc?.username === username)?.friends?.some((id:any)=> id === currentLoggedUserID);
    
    //find its username if its available in the visited account
    const isLoggedUserFound = isFriendRequest?.map((id:any)=> {
        return user?.find((acc:any)=> acc?.id === id)?.username;
    });

    //check if account currently logged is equal to the friend_request
    const isLoggedInRequest= isLoggedUserFound?.some((isLogged:any)=> isLogged === loggedUser);
    
    const userFriends = user?.find((user:any)=> user?.username === username)?.friends;

    return (
        <>  
            <h1>{username}</h1>
            <h2>Activity: {isOnline ? 'Online': 'Offline'}</h2>
            {
                // If the user is not a friend, show the appropriate button based on isLogged
                !isFriend && (
                    !isLoggedInRequest ? (
                        <button onClick={() => handleAddFriend(userId)}>Add friend</button>
                    ) : (
                        <button onClick={() => handleCancelFriend(userId)}>Cancel request</button>
                    )
                )
            }
            {
                // Show the unfriend button if the user is a friend
                isFriend ? (
                <button onClick={()=> handleUnfriend(userId)}>Unfriend</button>
                ) : ""
            }
            <h2>Post</h2>
            <h2><Link href={`/account/${username}/friends`}>friends: {userFriends?.length}</Link></h2>
            <ul>
                {
                    reversedOrderPost?.map((post:any)=>{
                        if(post?.user === userId){

                            const postId = post?.id;

                            return (
                                <li>
                                    <div>{formatCreatedTime(post?.created)}</div>
                                    <div>{post?.text_message}</div>
                                    <div>Likes: {post?.likes} Dislikes: {post?.dislikes}</div>
                                    <button onClick={()=> handleLikes(postId)}>like</button>
                                    <button onClick={()=> handleDislikes(postId)}>dislike</button>
                                </li>
                            )
                        }
                    })
                }
            </ul>

        </>
        
    );
}