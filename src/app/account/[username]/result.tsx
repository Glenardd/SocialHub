'use client';
import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

export default function result() {
    
    const username = useParams().username; 

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const { data } = useSWR('http://127.0.0.1:8090/api/collections/status_update/records/', fetcher, {revalidateOnFocus: false});
    
    const userAccount = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false}).data;

    const post = data?.items;

    const user = userAccount?.items;
    
    const isOnline = user?.find((acc:any)=> acc?.username === username)?.isOnline;

    return (
        <>  
            <h1>{username}</h1>
            <h2>Activity: {isOnline ? 'Online': 'Offline'}</h2>
            <Link href={'/account'}>Home</Link>
        </>
        
    )
}