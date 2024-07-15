'use client';
import { useFormik } from "formik";
import { useState } from "react";
import useSWR, { mutate } from 'swr';
import Link from "next/link";

export default function statusUpdate({userLogged, user}:any) {

    const [edit, setEdit] = useState<any>(false);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    // fetch the post
    const posts = useSWR('http://127.0.0.1:8090/api/collections/status_update/records/', fetcher, {revalidateOnFocus: false})?.data;
    
    const comments = useSWR("http://127.0.0.1:8090/api/collections/status_comments/records", fetcher, { revalidateOnFocus: false })?.data;

    const commentsData = comments?.items;

    const post = posts?.items;

    const reversedOrderPost = post?.map((post: any) => post)?.reverse();
    
    //find id of user
    const currentLoggedUserID = user?.find((acc:any)=> acc?.username === userLogged)?.id;

    const statusForms = useFormik({
        initialValues:{
            text_message: '',
        },
        onSubmit: (values)=>{
            const data = {
                "text_message": values.text_message,
                "user": currentLoggedUserID,
            }

            const postStatus = async () =>{
                try{
                    const response = await fetch("http://127.0.0.1:8090/api/collections/status_update/records", {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
    
                    if(response.ok){
                        mutate('http://127.0.0.1:8090/api/collections/status_update/records');
                    }
                }catch(error){
                    console.log(error);
                }
            }

            if(values.text_message === ""){

            }else{
                postStatus();
            };
        }
    });

    const editForm = useFormik({
        initialValues:{
            text_message: '',
        },
        onSubmit: (values) =>{
            const data = {
                "text_message": values.text_message,
            };

            post?.map((post:any)=> {
                if(post?.id === edit){

                    const postId = post?.id;

                    const edit = async () =>{
                        try{
                            const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
                                method: 'PATCH',
                                headers: {
                                'Content-Type': 'application/json',
                                },
                                body:JSON.stringify(data),
                            });
                    
                            if (response.ok) {
                                mutate('http://127.0.0.1:8090/api/collections/status_update/records');
                            }

                            setEdit(false);

                        }catch (error){
                            console.log(error);
                        };
                    };
                    
                    if(values.text_message === ""){

                    }else{
                        edit();
                    }
                }
            });
        }
    })
    
    const handlePostDelete = async (id:any) => {
        try {
          const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            mutate("http://127.0.0.1:8090/api/collections/status_update/records");
          }
        } catch (error) {
          console.log(error);
        }
    }

    const handlePostEdit = (id:any) =>{
        setEdit(id);
        const text_currentVal = post?.find((post:any)=>post?.id === id)?.text_message;
        editForm.setFieldValue("text_message", text_currentVal);
    };


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

    const handleLikes = async (postId: any) => {
        const foundPost = post?.find((post:any)=> post?.id === postId);
        const usersWhoLike = foundPost?.user_likes;

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
                mutate("http://127.0.0.1:8090/api/collections/status_update/records/");    
            };
        }catch(error){
            console.log(error);
        };
    };

    const numComments = (postId:any) => {
        const commentNum = commentsData?.filter((comments:any)=> comments?.post_assigned === postId).length;
        return commentNum;
    };

    return (
       <>  
            <form onSubmit={statusForms.handleSubmit}>
                <input
                    placeholder="What's on your mind"
                    name="text_message"
                    type="text_message"
                    onChange={statusForms.handleChange}
                    value={statusForms.values.text_message}
                />
                <button type="submit">post</button>
            </form>
            <ul>
                {reversedOrderPost?.map((post: any) => {
                    if (post?.user === currentLoggedUserID) {
                        
                        const postId = post?.id;

                        return (
                            <>
                                <li key={currentLoggedUserID}>
                                    {
                                        edit === postId && (
                                            <>
                                                <form onSubmit={editForm.handleSubmit}>
                                                    <input
                                                        placeholder={`${null}`}
                                                        type="text_message" 
                                                        name="text_message" 
                                                        value={editForm.values.text_message} 
                                                        onChange={editForm.handleChange}/>
                                                    <button type="submit">post</button>
                                                </form>
                                                <button onClick={()=>setEdit(false)}>cancel</button>
                                            </>
                                        ) 
                                    }
                                    {
                                        edit !== postId && (
                                            <>
                                                <Link href={`/account/post/${postId}`}>
                                                    <div>Posted {formatCreatedTime(post?.created)}</div>
                                                    <div>{post.text_message}</div>
                                                </Link>
                                                <div>Likes: {post?.user_likes?.length} Comments: {numComments(postId)}</div>
                                                <button onClick={()=>handleLikes(postId)}>like</button>
                                                <button onClick={()=>{handlePostEdit(postId);}}>Edit</button>
                                                <button onClick={()=> handlePostDelete(postId)}>Delete</button>
                                            </>
                                        )
                                    }
                                </li>
                            </>
                        );
                    }
                })}
            </ul>
       </>
    )
}
