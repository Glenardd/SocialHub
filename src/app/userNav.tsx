"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Search from "./search";
import { getCookie, removeCookie } from "typescript-cookie";
import { useRouter } from "next/navigation";
import useSWR, {mutate} from "swr";

export default function UserNav() {
  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(() => {
    // Access cookies only on the client side
    const user = getCookie("isLogged") || null;
    setUserLogged(user);
  }, []);

  const router = useRouter();

  const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

  const accounts = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false })?.data;

  const post = useSWR("http://127.0.0.1:8090/api/collections/status_update/records", fetcher, { revalidateOnFocus: false })?.data;

  const notif = useSWR("http://127.0.0.1:8090/api/collections/user_notification/records", fetcher, { revalidateOnFocus: false })?.data;

  const comments = useSWR("http://127.0.0.1:8090/api/collections/status_comments/records", fetcher, { revalidateOnFocus: false })?.data;

  const commentNotif = useSWR("http://127.0.0.1:8090/api/collections/user_comments_notification/records", fetcher, { revalidateOnFocus: false })?.data;

  const commentNotifData = commentNotif?.items;
  
  const commentsData = comments?.items;

  const userNotif = notif?.items;

  const user = accounts?.items;

  const posts = post?.items;

  //data of the logged user
  const loggedUser = user?.find((acc:any)=> acc?.username === userLogged);
  //id of the logged user
  const loggedUserId = loggedUser?.id

  const handleLogout = async () => {

    //when logged out isOnline should be false
    const isOnline = {
      "isOnline": false,
    };

    try{
      const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${loggedUserId}`,{
        method: "PATCH",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(isOnline),
      });

      if(response.ok){
        mutate("http://127.0.0.1:8090/api/collections/accounts/records");
      }
    }catch(error){
      console.log(error);
    }

    removeCookie("isLogged");
    router.push("/");

  };

  //post notif data for likes
  //logged user
  const foundUserNotif = userNotif?.filter((notif:any)=> notif?.user_account === loggedUserId);

  //searches notifs here
  const reactsFoundData = foundUserNotif?.filter((comments:any)=>{
    return commentsData?.map((notif: any) => notif?.post_reacted?.includes(comments?.post_assigned));
  })?.map((reacts: any) => {
    return {
      type: reacts?.type,
      user_account: reacts?.user_account,
      user_interacted: user?.find((acc:any)=> acc?.id === reacts?.user_interacted)?.username,
      post_reacted: posts?.find((post:any)=> post?.id === reacts?.post_reacted)?.text_message,
      post_reactedID: reacts?.post_reacted,
      post_created: reacts?.created,
    };
  });

  //post notif data for comments
  const foundCommentNotif = commentNotifData?.filter((notif:any)=> notif?.owner_comment === loggedUserId);
  //searches comment notifs here
  const commentsFoundData = foundCommentNotif?.filter((comments:any)=>{
    return commentsData?.map((notif: any) => notif?.post_reacted?.includes(comments?.post_assigned));
  })?.map((comments: any) => {
    return {
      owner_comment: comments?.owner_comment,
      user_commented: user?.find((acc:any)=> acc?.id === comments?.user_commented)?.username,
      post_commented: posts?.find((post:any)=> post?.id === comments?.post_commented)?.text_message,
      post_commentedID: comments?.post_commented, 
      text_comment: comments?.text_comment,
      post_created: comments?.created,
    };
  });

  //combined notification from normal like reaction to comment notif, arrange according to date created
  const combinedData = [...(reactsFoundData || []), ...(commentsFoundData || [])].sort((a: any, b: any) => a.post_created - b.post_created).reverse();

  return (
    <>
      <Link href="/home">home</Link>
      <Link href="/account">{userLogged}</Link>
      {/* <button onClick={handleDeleteAcc}>Delete account</button> */}
      <button onClick={handleLogout}>Logout</button>
      <Search />
      <ul>
      {
        combinedData?.map((reacts:any, index:number)=> {
          return(
            <li key={index}>
              <Link href={`/account/${reacts?.owner_comment || reacts?.user_account}/post/${reacts.post_commentedID || reacts.post_reactedID}`}>
                <p>{reacts.user_interacted || reacts?.user_commented} {reacts.type || `commented "${reacts.text_comment}" on`} "{reacts.post_reacted || reacts.post_commented}"</p>
              </Link>
            </li>
          )
        })
      }
      </ul>
    </>
  );
}
