"use client";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from 'swr';
import { removeCookie, getCookie } from "typescript-cookie";
import StatusUpdate from "./statusUpdate";
import Link from "next/link";

export default function Accounts() {

    const user = getCookie("isLogged");

    const router = useRouter();

    const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

    const { data } = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false });

    const accounts = data?.items || [];

    const handleLogout = async () => {
        for (const account of accounts) {
            if (user && account.username === user) {
                const accountId = account?.id;

                const updateActivity = async () => {
                    const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ isOnline: false }),
                    });
                    if (response.ok) {
                        mutate(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`);
                    }
                };

                await updateActivity();
                removeCookie("isLogged");
                router.push("/");
            }
        }
    };

    const handleDeleteAcc = async () => {
        for (const account of accounts) {
            if (account?.username === user) {
                const accountId = account?.id;

                const updateDelete = async () => {
                    const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.ok) {
                        mutate(`http://127.0.0.1:8090/api/collections/accounts/records`);
                    }
                };

                await updateDelete();
                removeCookie('isLogged');
                router.push('/')
            }
        }
    };

    const isOnline = accounts?.find((acc:any) => acc?.username === user)?.isOnline;

    const friends = accounts?.find((acc:any) => acc?.username === user)?.friends;
    const friendRequests = accounts?.find((acc:any) => acc?.username === user)?.friend_requests;

    return (
        <>
            {   
                !data ? "" : (
                    <>
                        <h1>User page</h1>
                        <h2>Welcome {user}!</h2>
                        <h2>Acitivity: {isOnline ? 'online': 'offline'}</h2>
                        <h2><Link href={"/account/friends"}>{friends.length} friends</Link></h2>
                        <h2><Link href={"/account/friend-requests"}>{friendRequests?.length} friend requests</Link></h2>
                        <button onClick={handleDeleteAcc}>Delete account</button>
                        <button onClick={handleLogout}>Logout</button>
                        <br />
                        <br />
                        <h2>Post</h2>
                        <StatusUpdate user={user} userInfo={accounts}/>
                    </>
                )
            }
        </>
    );
}
