'use client';
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";

export default function result() {
    
    const username = useParams().username; 

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const status_update = useSWR('http://127.0.0.1:8090/api/collections/status_update/records/', fetcher, {revalidateOnFocus: false})?.data;
    
    const userAccount = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false})?.data;

    const comments = useSWR("http://127.0.0.1:8090/api/collections/status_comments/records", fetcher, { revalidateOnFocus: false })?.data;

    const notif = useSWR("http://127.0.0.1:8090/api/collections/user_notification/records", fetcher, { revalidateOnFocus: false })?.data;

    const userNotif = notif?.items

    //comments data
    const commentsData = comments?.items;

    //post data
    const post = status_update?.items;

    const reversedOrderPost = post?.map((post: any) => post)?.reverse();

    const user = userAccount?.items;
    
    const isOnline = user?.find((acc:any)=> acc?.username === username)?.isOnline;

    //userId of the search account
    const userId = user?.find((acc:any)=> acc?.username === username)?.id;

    // the main user logged in
    const [loggedUser, setLoggedUser] = useState<string | null>(null);

    //current logged user id
    const currentLoggedUserID = user?.find((acc: any)=> acc?.username === loggedUser)?.id;

    //friends of the logged user
    const currentLoggedUserFriends = user?.find((acc: any)=> acc?.username === loggedUser)?.friends;

    //get the data of the added account
    const addedUser = user?.find((acc: any)=> acc?.id === userId);

    //get the friend request property
    const addedUserFriendRequest = addedUser?.friend_requests;

    useEffect(()=>{
        const userLogged = getCookie("isLogged") || null;
        setLoggedUser(userLogged);
    },[])

    const numComments = (postId:any) => {
        const commentNum = commentsData?.filter((comments:any)=> comments?.post_assigned === postId).length;
        return commentNum;
    };

    //time format of post
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

    //likes
    const handleLikes = async (postId: any) => {
        const foundPost = post?.find((post: any) => post?.id === postId);
        const userLikes = foundPost?.user_likes;

        const removeNotif = async (notifId: any) => {
            try {
                const notification = await fetch(`http://127.0.0.1:8090/api/collections/user_notification/records/${notifId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (notification.ok) {
                    mutate("http://127.0.0.1:8090/api/collections/user_notification/records");
                };
            } catch (error) {
                console.log(error);
            };
        };

        const hasLiked = () => {
            const checkUserLikes = userLikes?.includes(currentLoggedUserID);
            if (checkUserLikes) {
                const removeLikeUser = userLikes?.filter((userId: any) => userId !== currentLoggedUserID);
                return removeLikeUser;
            } else {
                const addLikeUser = [...userLikes, currentLoggedUserID];
                return addLikeUser;
            }
        };

        const likeData = {
            "user_likes": hasLiked(),
        };

        try {
            const like = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(likeData),
            });

            if (like.ok) {
                mutate("http://127.0.0.1:8090/api/collections/status_update/records/");
                const notifId = userNotif?.find((notif: any) => notif?.post_reacted === postId && notif?.user_interacted === currentLoggedUserID)?.id;
                const hasLikedPost = userLikes?.includes(currentLoggedUserID);

                if (hasLikedPost && notifId) {
                    await removeNotif(notifId);
                } else if (!hasLikedPost) {
                    const notificationData = {
                        "user_account": userId,
                        "user_interacted": currentLoggedUserID,
                        "type": "liked",
                        "post_reacted": postId,
                    };

                    try {
                        const notification = await fetch("http://127.0.0.1:8090/api/collections/user_notification/records", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(notificationData),
                        });

                        if (notification.ok) {
                            mutate("http://127.0.0.1:8090/api/collections/user_notification/records");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    
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
            };
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
                    reversedOrderPost?.map((post:any, index:number)=>{
                        if(post?.user === userId){

                            const postId = post?.id;

                            return (
                                <li key={index}>
                                    <Link href={`/account/${username}/post/${postId}`}>
                                        <div>{formatCreatedTime(post?.created)}</div>
                                        <div>{post?.text_message}</div>
                                    </Link>
                                    <div>Likes: {post?.user_likes?.length} comments: {numComments(postId)}</div>
                                    <button onClick={()=> handleLikes(postId)}>like</button>
                                </li>
                            )
                        }
                    })
                }
            </ul>

        </>
        
    );
}