'use client';
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import useSWR, { mutate } from "swr";
import { setCookie } from "typescript-cookie";
import { useState } from "react";

export default function Forms(){

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const { data } = useSWR( 'http://127.0.0.1:8090/api/collections/accounts/records',fetcher, {revalidateOnFocus: true});

    const [userUsername, setUserUsername] = useState<boolean>(true);
    const [userPassword, setUserPassword] = useState<boolean>(true);

    const router = useRouter();

    const forms = useFormik({
        initialValues:{
            username: '', 
            password: '',
        },
        onSubmit: values =>{
            const accounts = data?.items;

            accounts?.map((account: any)=>{
                if(account?.username === values.username && account?.password ===  values.password){

                    //create a json for changes
                    const data = {
                        "isOnline": true,
                    }

                    setCookie('isLogged', account?.username);

                    const accountId = account?.id;
                    
                    const updateUser = async () => {
                        
                        //create a http request
                        await fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`,{
                            method: "PATCH",
                            headers:{
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });
                    }

                    //to save changes
                    mutate(`http://127.0.0.1:8090/api/collections/accounts/records/${accountId}`);

                    updateUser();

                    router.push('/home');

                }else{
                    const userUsername = accounts?.some((account: any) => account.username === values.username?true:false);
                    const userPassword = accounts?.some((account: any) => account.password === values.password?true:false);
                    
                    setUserUsername(userUsername);
                    setUserPassword(userPassword);

                    setTimeout(() => {
                        setUserUsername(true);
                        setUserPassword(true);
                    }, 800);
                    
                }
            });
        }
    });

    return(
        <>
            <h1>Sign in page</h1>

            <form onSubmit={forms.handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username" 
                    type="text"
                    onChange={forms.handleChange}
                    value={forms.values.username} 
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password" 
                    type="text"
                    onChange={forms.handleChange}
                    value={forms.values.password} 
                />
                <button type="submit">Sign in</button>
                { !userUsername && (<h2>Username and password is wrong</h2>) || !userPassword && (<h2>Username and password is wrong</h2>)}
            </form>
        </>
    );
}