"use client";
import { useParams } from "next/navigation"
import useSWR, {mutate} from "swr";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";
import { useFormik } from "formik";

export default function view_post() {

  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(()=>{
    const userCookie = getCookie("isLogged") || null;
    setUserLogged(userCookie);
  },[]);

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;
  const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;
  const comments = useSWR("http://127.0.0.1:8090/api/collections/status_comments/records", fetcher, { revalidateOnFocus: false })?.data;
  const notif = useSWR("http://127.0.0.1:8090/api/collections/user_notification/records", fetcher, { revalidateOnFocus: false })?.data;

  const userNotif = notif?.items

  //comments data
  const commentsData = comments?.items;

  //get the accounts
  const user = accounts?.items;

  //get the post
  const postData = post?.items;

  const params = useParams();

  //post id params
  const postId = params.postID;

  //logged user
  const loggedUserId = user?.find((acc:any)=>acc?.username === userLogged)?.id

  //find that post id
  const foundPost = postData?.find((post:any)=> post?.id === postId);

  const postTextMessage = foundPost?.text_message;

  const postCreated = foundPost?.created;
  
  const usersWhoLikeNum = foundPost?.user_likes?.length;

  const usersWhoLike = foundPost?.user_likes;

  //get the username of the post user
  const currentLoggedUserUsername = user?.find((acc:any)=>acc?.id === loggedUserId)?.username;

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
        const checkUser = usersWhoLike?.includes(loggedUserId);

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
            mutate("http://127.0.0.1:8090/api/collections/status_update/records");
        };
    }catch(error){
        console.log(error);
    };  
  };

  const handleCommentsLike = async (commentId:any) =>{

    const comments = commentsData?.find((comment:any)=>comment?.id === commentId);
    const commentLikes = comments?.user_likes;

    const checkUser = commentLikes?.includes(loggedUserId);

    const hasLiked = () =>{
      if(checkUser){
        const removeCommentLike = commentLikes?.filter((userlike:any)=> userlike !== loggedUserId);
        return removeCommentLike;
      }else{
        const addCommentLike = [...commentLikes, loggedUserId];
        return addCommentLike;
      };
    };

    const commentLikeData = {
      "user_likes": hasLiked(),
    };

    try{
      const likeComment = await fetch(`http://127.0.0.1:8090/api/collections/status_comments/records/${commentId}`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentLikeData),
      });

      if(likeComment.ok){
        mutate("http://127.0.0.1:8090/api/collections/status_comments/records");
        //if comment owner is different from the current logged in user
        // the current logged in user can like the user post
        const notifId = userNotif?.find((notif: any) => notif?.comment_reacted === commentId && notif?.user_interacted === loggedUserId)?.id;
        const foundPost = commentsData?.find((comment: any) => comment?.id === commentId);
        const userLikes = foundPost?.user_likes;
        const foundPostOwner = foundPost?.user;

        console.log(userLikes)
        console.log(loggedUserId)

        const hasLikedPost = userLikes?.includes(loggedUserId);

        const removeCommentNotif = async (notifId: any) => {
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

        if(notifId && hasLikedPost && foundPostOwner !== loggedUserId){
          await removeCommentNotif(notifId);
        }else if(!hasLikedPost && foundPostOwner !== loggedUserId){
          const commentNotifData = {
            "user_account": foundPostOwner,
            "comment_reacted_post":postId,
            "user_interacted":loggedUserId,
            "type": "liked",
            "comment_reacted": commentId, 
          };
  
          try{
            const likeCommentNotif = await fetch("http://127.0.0.1:8090/api/collections/user_notification/records",{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(commentNotifData),
            });
    
            if(likeCommentNotif.ok){
              mutate("http://127.0.0.1:8090/api/collections/user_notification/records");
            };
          }catch(error){
            console.log(error);
          };
        };
      };
    }catch(error){
      console.log(error);
    };
  };

  const handleDeleteComment = async (commentId:any) =>{
    try{
      const deleteComment = await fetch(`http://127.0.0.1:8090/api/collections/status_comments/records/${commentId}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(deleteComment.ok){
        mutate("http://127.0.0.1:8090/api/collections/status_comments/records");
      };

    }catch(error){
      console.log(error);
    };
  };

  const commentsForm = useFormik({
    initialValues:{
      comment: "",
    },
    onSubmit: values =>{
      
      if(values.comment === ""){

      }else{

        const commentData = {
          "comment": values.comment,
          "user": loggedUserId,
          "post_assigned": postId,
        };

        const commentSubmit = async () =>{
          try{
            const commentInput = await fetch(`http://127.0.0.1:8090/api/collections/status_comments/records/`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(commentData),
            });

            if(commentInput.ok){
              mutate("http://127.0.0.1:8090/api/collections/status_comments/records");
            }
          }catch(error){
            console.log(error);
          }
        }

        commentSubmit();

      };
    }
  });

  const foundComment = commentsData?.filter((comments:any)=> comments?.post_assigned === postId);

  const loggedUser = currentLoggedUserUsername === userLogged ? "(You)" : "";

  return (
    <>
      <h2><Link href={loggedUser ? "/account":""}>{currentLoggedUserUsername}{loggedUser}</Link></h2>
      <h2>Posted: {formatCreatedTime(postCreated)}</h2>
      <h2>{postTextMessage}</h2>
      <h2>Likes: {usersWhoLikeNum}</h2>
      <button onClick={()=> handleLikes(postId)}>like</button>
      <form onSubmit={commentsForm.handleSubmit}>
        <input 
          type="comment" 
          name="comment" 
          placeholder="comment" 
          onChange={commentsForm.handleChange}
          value={commentsForm.values.comment}
        />
        <button type="submit">comment</button>
      </form>
      <ul>
      {
          foundComment?.map((comments:any, index:number)=>{

            const usernameComment = user?.find((acc:any)=>acc?.id === comments?.user)?.username;
            const commentLikes = comments?.user_likes?.length;
            const commentText = comments?.comment;
            const commentId = comments?.id;
            const commentCreated = formatCreatedTime(comments?.created);

            return(
              <li key={index}>
                <h2>{usernameComment}</h2>
                <b>{commentCreated}</b>
                <p>{commentText}</p>
                <p>Likes: {commentLikes}</p>
                <button onClick={()=>handleCommentsLike(commentId)}>like</button>
                <button onClick={()=>handleDeleteComment(commentId)}>delete</button>
              </li>
            )
          }).reverse()
        }

      </ul>
    </>
  )
}
