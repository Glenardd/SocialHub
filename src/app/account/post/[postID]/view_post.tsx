"use client";
import { useParams } from "next/navigation"
import useSWR, {mutate} from "swr";

export default function view_post() {

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

  //get the post
  const postData = post?.items;

  const params = useParams();

  //post id params
  const postId = params.postID;

  //find that post id
  const foundPost = postData?.find((post:any)=> post?.id === postId);

  const postTextMessage = foundPost?.text_message;
  const postOwner = foundPost?.user;
  const postCreated = foundPost?.created;
  const postLikes = foundPost?.likes;
  const postDislikes = foundPost?.dislikes;

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
  const handleLikes = async (postId:any) =>{
    
    const likeData = {
      ...postLikes,
      "likes": postLikes+1,
    };

    const like = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likeData),
    });

    if(like.ok){
      mutate("http://127.0.0.1:8090/api/collections/status_update/records");
    };
  };

  //dislikes
  const handleDislikes = async (postId:any) =>{
    
    const dislikeData = {
      ...postDislikes,
      "dislikes": postDislikes+1,
    };

    const dislike = await fetch(`http://127.0.0.1:8090/api/collections/status_update/records/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dislikeData),
    });

    if(dislike.ok){
      mutate("http://127.0.0.1:8090/api/collections/status_update/records");
    };
  };

  return (
    <>
      <h2>{formatCreatedTime(postCreated)}</h2>
      <h2>{postTextMessage}</h2>
      <h2>Likes: {postLikes} Dislikes: {postDislikes}</h2>
      <button onClick={()=> handleLikes(postId)}>like</button>
      <button onClick={()=> handleDislikes(postId)}>dislike</button>
    </>
  )
}
