'use client';
import { useFormik } from "formik";
import { useState } from "react";
import useSWR, { mutate } from 'swr';

export default function statusUpdate({user, userInfo}:any) {

    const [edit, setEdit] = useState<boolean>(false);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    // fetch the post
    const { data } = useSWR('http://127.0.0.1:8090/api/collections/status_update/records/', fetcher, {revalidateOnFocus: false});
    
    const post = data?.items;

    //find id of user
    const userId = userInfo?.find((acc:any)=> acc.username === user)?.id;

    const statusForms = useFormik({
        initialValues:{
            text_message: '',
        },
        onSubmit: (values)=>{
            const data = {
                "text_message": values.text_message,
                "user": userId,
            }

            const postStatus = async () =>{
                try{
                    const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records`, {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
    
                    if(response.ok){
                        mutate('http://127.0.0.1:8090/api/collections/status_update/records/');
                    }
                }catch(error){
                    console.log(error);
                }
            }

            postStatus();
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
                                mutate('http://127.0.0.1:8090/api/collections/status_update/records/');
                            }

                            setEdit(false);

                        }catch (error){
                            console.log(error);
                        };
                    };
        
                    edit();
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
            mutate('http://127.0.0.1:8090/api/collections/status_update/records/');
          }
        } catch (error) {
          console.log(error);
        }
    }

    const handlePostEdit = async (id:any) =>{
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
    
        // if (edited && edited !== created) {
        //     const editedDate = new Date(edited);
        //     const editedDiffInSeconds = (now.getTime() - editedDate.getTime()) / 1000;
        //     const editedDiffInMinutes = editedDiffInSeconds / 60;
        //     const editedDiffInHours = editedDiffInMinutes / 60;
    
        //     let editedTime = '';
    
        //     if (editedDiffInSeconds < 60) {
        //         editedTime = 'Just now';
        //     } else if (editedDiffInMinutes < 60) {
        //         const minutes = Math.floor(editedDiffInMinutes);
        //         editedTime = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        //     } else if (editedDiffInHours < 24) {
        //         const hours = Math.floor(editedDiffInHours);
        //         editedTime = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        //     } else {
        //         const isDifferentYear = editedDate.getFullYear() !== now.getFullYear();
        //         const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        //         if (isDifferentYear) {
        //             options.year = 'numeric';
        //         }
        //         editedTime = editedDate.toLocaleString('default', options);
        //     }
    
        //     return `${createdTime} (edited)`;
        // }
    
        return createdTime;
    };

    const handleLikes = async (id: any) => {
        const userPosts = post?.filter((post: any) => post.user === userId);

        const newPosts = userPosts?.map((post: any) => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: post.likes + 1
                };
            }
            return post;
        });

        const likes = {
            "likes": newPosts.find((post: any) => post.id === id)?.likes,
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8090/api/collections/status_update/records/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(likes),
                }
            );

            if (response.ok) {
                mutate(
                    "http://127.0.0.1:8090/api/collections/status_update/records/"
                );
            }
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    const handleDislikes = async (id:any) =>{
        const userPosts = post?.filter((post: any) => post.user === userId);

        const newPosts = userPosts?.map((post: any) => {
            if (post.id === id) {
                return {
                    ...post,
                    dislikes: post.dislikes + 1
                };
            }
            return post;
        });

        const dislikes = {
            "dislikes": newPosts.find((post: any) => post.id === id)?.dislikes,
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8090/api/collections/status_update/records/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dislikes),
                }
            );

            if (response.ok) {
                mutate(
                    "http://127.0.0.1:8090/api/collections/status_update/records/"
                );
            }
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    return (
       <>   
            <h2>Share your thoughts:</h2>
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
                {post?.map((post: any) => {
                    if (post?.user === userId) {

                        const userId = post?.id;

                        return (
                            <>
                                <li key={userId}>
                                    {
                                        edit === userId && (
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
                                        edit !== userId && (
                                            <>  
                                                <div>Posted {formatCreatedTime(post?.created)}</div>
                                                <div>{post.text_message}</div>
                                                <div>Likes: {post?.likes} Dislikes: {post?.dislikes}</div>
                                                <button onClick={()=>handleLikes(userId)}>like</button>
                                                <button onClick={()=>handleDislikes(userId)}>dislike</button>
                                                <button onClick={()=>{
                                                    handlePostEdit(userId);
                                                }}>Edit</button>
                                                <button onClick={()=> handlePostDelete(userId)}>Delete</button>
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
