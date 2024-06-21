'use client';
import useSWR from "swr";
import Link from 'next/link';
import { getCookie } from "typescript-cookie";
import { usePathname } from "next/navigation";

export default function Result({searchResult}:any) {
  
  const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

  const { data } = useSWR('http://127.0.0.1:8090/api/collections/accounts/records/', fetcher, {revalidateOnFocus: false});

  const userAccounts = data?.items;

  const userLogged = getCookie('isLogged');

  const resultsPath = usePathname();

  const hasResults = userAccounts?.some((acc: any) => {
    return acc?.username.toLowerCase().startsWith(searchResult?.toLowerCase());
  });

  //to stop showing "Not found" in the /account route
  const userResultsPath = resultsPath === "/account/user" ? true : false;

  return (
    <>
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
      {
        //Will only show if in the path of /account/user
        //and will show only if search results were not found
        userResultsPath && !hasResults && <div>Not found</div>
      }
    </>
  )
}
