'use client';

import useSWR from "swr";
import { string } from "yup";

export default function result({searchResult}:any) {
  
  const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

  const { data } = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false});

  const userAccounts = data?.items;

  return (
    <>
        <div>Results:</div>
        <ul>
          {
            userAccounts?.map((acc:any)=>{

              const caseSensitiveCheck = acc?.username.toLowerCase().startsWith(searchResult?.toLowerCase());
              if(caseSensitiveCheck){
                return <li>{acc?.username}</li>
                
              }
            })
          }          
        </ul>
    </>
  )
}
