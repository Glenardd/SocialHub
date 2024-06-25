"use client";
import useSWR, { mutate } from "swr";

export default function postDisplay() {

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const postData = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

    const userData = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

    const allPost = postData?.items;
    const allUser = userData?.items;

    const post = allPost?.map((post: any) => post)?.reverse();
    const user = allUser?.map((user: any) => user)?.reverse();

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

    const handleLikes = async (id:any) =>{
        const newPosts = post?.map((post:any)=>{
           if(post?.id === id){
                return {
                    ...post,
                    likes: post?.likes + 1,
                }
            }

            return post;
        });

        const likes = {
            "likes": newPosts?.find((post:any)=> post?.id === id)?.likes,
        };

        const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(likes),
        });

        if(response.ok){
            mutate("http://127.0.0.1:8090/api/collections/status_update/records")
        };
    };

    const handleDislikes = async (id:any) =>{
        const newPosts = post?.map((post:any)=>{
            if(post?.id === id){
                 return {
                    ...post,
                    dislikes: post?.dislikes + 1,
                 }
             }
 
             return post;
         });
 
         const dislikes = {
             "dislikes": newPosts?.find((post:any)=> post?.id === id)?.dislikes,
         };
 
         const response = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${id}`, {
             method: "PATCH",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify(dislikes),
         });
 
         if(response.ok){
             mutate("http://127.0.0.1:8090/api/collections/status_update/records")
         };
    }

    return (
        <>
            <h1>Post display</h1>
            <ul>
                {
                    post?.map((post:any)=>{
                        return (
                            <li key={post?.id}>
                                <div>User: {user?.find((user:any)=> user?.id === post?.user)?.username}</div>
                                <div>{formatCreatedTime(post?.created)}</div>
                                <div>{post?.text_message}</div>
                                <div>Likes: {post?.likes} Dislikes: {post?.dislikes}</div>
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
