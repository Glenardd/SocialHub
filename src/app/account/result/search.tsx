import React from 'react'
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { getCookie } from 'typescript-cookie';

export default function search() {
    const params = useSearchParams();

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const data = useSWR("http://127.0.0.1:8090/api/collections/accounts/records", fetcher, { revalidateOnFocus: false }).data;

    const username = data?.items; 

    const loggedUser = getCookie('isLogged');

    const search = params.get('search');

    return (
        <>
            <div>Search results</div>
            <ul>
                {
                    username?.map((acc:any)=>{

                        const user = acc?.username

                        const findAccounts = user?.toLowerCase().startsWith(search?.toLowerCase());
                        
                        if(findAccounts){

                            const foundAccount =acc?.username;

                            //the person loggedin
                            const you = loggedUser === foundAccount ? "(You)" : "";

                            //list of found account searched
                            return (
                                <li key={acc?.id}>
                                    <li><Link href={you ? "/account": `/account/${foundAccount}`}>{foundAccount}{you}</Link></li>
                                </li>
                            )
                        };
                        
                    })
                }
            </ul>
        </>
    )
}
