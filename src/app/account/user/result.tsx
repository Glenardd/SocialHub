'use client';
import useSWR from "swr";
import Link from 'next/link';
import { getCookie } from "typescript-cookie";

export default function Result({searchResult}:any) {
  
  const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

  const { data } = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false});

  const userAccounts = data?.items;

  const userLogged = getCookie('isLogged');

  const hasResults = userAccounts?.some((acc: any) =>
    acc?.username.toLowerCase().startsWith(searchResult?.toLowerCase())
  );

  return (
    <>
        {
          hasResults ? (
            <ul>
              {
                userAccounts?.map((acc:any)=>{

                  const username = acc?.username;

                  const caseSensitiveCheck = acc?.username.toLowerCase().startsWith(searchResult?.toLowerCase());

                  const isUserLogged = acc?.username.toLowerCase().startsWith(userLogged?.toLowerCase());

                  if(caseSensitiveCheck){
                    return (
                      <li><Link href={ isUserLogged ? "/account" : `/account/${username}`}>{username}{isUserLogged ? '(you)': ''}</Link></li>
                    )
                  }
                })
              }          
            </ul>
          ) : (
            <div>Not found</div>
          )
        }
        
    </>
  )
}
