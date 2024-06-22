'use client';
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";

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

    return (
        <>  
            <Link href={'/account'}>Home</Link>
            <h1>{username}</h1>
            <h2>Activity: {isOnline ? 'Online': 'Offline'}</h2>
            <h2>Post</h2>
            <ul>
                {
                    reversedOrderPost?.map((post:any)=>{
                        if(post?.user === userId){

                            const postId = post?.id;

                            return (
                                <li>
                                    {post?.text_message}
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
        
    )
}