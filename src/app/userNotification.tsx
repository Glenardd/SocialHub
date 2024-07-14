"use client";
import React from 'react'
import { mutate } from 'swr';

export default function userNotification({posts, loggedUserId, user}:any) {

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

    // Filter posts owned by the logged-in user
    const postsOwner = posts?.filter((post:any)=> post?.user === loggedUserId);

    // Collect all interactions (likes and dislikes) and sort them by time
    const interactions = postsOwner?.flatMap((post:any) => [
        ...post.user_likes.map((userLike:any) => ({ user: user?.find((acc:any)=> acc?.id === userLike)?.username, type: "liked", created: formatCreatedTime(post?.updated), postId: post?.text_message })),
    ]).sort((a:any, b:any) => {
        if (a.created === 'Just now') return -1;
        if (b.created === 'Just now') return 1;
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    mutate("http://127.0.0.1:8090/api/collections/status_update/records");

    return (
        <>  
            <ul>
                {interactions?.map((interaction:any, index:any) => (
                    <li key={index}>
                        {interaction.user} {interaction.type} your post ({interaction.created}) {interaction.postId}
                    </li>
                ))}
            </ul>
        </>
    );
}
