"use client";
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { getCookie, removeCookie } from 'typescript-cookie';
import StatusUpdate from './statusUpdate';
import Search from './user/search';

export default function Accounts() {

    const router = useRouter();

    const fetcher = (url: string, options: RequestInit = {}) => fetch(url, options).then((res) => res.json());

    const { data } = useSWR('http://127.0.0.1:8090/api/collections/accounts/records', fetcher, { revalidateOnFocus: false });

    if (!data) {
        console.log('loading');
        return <div>Loading...</div>;
    }

    const accounts = data?.items;
    const user = getCookie('isLogged') === null ? null: getCookie('isLogged');

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
                removeCookie('isLogged');
            }
        }
        router.push('/signin');
    };

    const handleDeleteAcc = async () => {
        for (const account of accounts) {
            if (account?.username === user) {
                const accountId = account?.id;

                const updateDelete = async () => {
                    const response = await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
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

    return (
        <>
            <h1>User page</h1>
            <Search />
            <h2>Welcome {user}!</h2>
            <h2>Acitivity: {isOnline ? 'online': 'offline'}</h2>
            <button onClick={handleDeleteAcc}>Delete account</button>
            <button onClick={handleLogout}>Logout</button>
            <br />
            <br />
            <h2>Post</h2>
            <StatusUpdate user={user} userInfo={accounts}/>
        </>
    );
}
