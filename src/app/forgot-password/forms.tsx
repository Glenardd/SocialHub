'use client';
import useSWR from 'swr';

import UsernameForm from './usernameForm';

export default function forms() {

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());
    
    const { data } = useSWR('http://127.0.0.1:8090/api/collections/accounts/records', fetcher, {revalidateOnFocus: false});

    return (
      <>
        <UsernameForm accounts={data}/> 
      </>
    )
  }
  