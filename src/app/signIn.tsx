'use client';
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import useSWR, { mutate } from "swr";
import { setCookie } from "typescript-cookie";
import { useState } from "react";
import Link from "next/link";

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
            <div className="container min-vh-100 d-flex justify-content-center align-items-center">
                <div className="mb-3">
                    <div className="mb-3">
                        <h1>Signin</h1>
                    </div>

                    <form onSubmit={forms.handleSubmit}>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                id="username"
                                name="username" 
                                type="text"
                                onChange={forms.handleChange}
                                value={forms.values.username}
                                placeholder="Username" 
                            />
                        </div>

                        <div className="mb-3">
                            {/* password */}
                            <input
                                className="form-control"
                                id="password"
                                name="password" 
                                type="password"
                                onChange={forms.handleChange}
                                value={forms.values.password}
                                placeholder="Password"
                            />
                            { !userUsername && (<h2>Username and password is wrong</h2>) || !userPassword && (<h2>Username and password is wrong</h2>)}
                        </div>

                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Sign in</button>  
                        </div>
                        
                        <Link className="link-offset-2 link-underline link-underline-opacity-0" href={'/signup'}>Signup </Link>
                        <Link className="link-offset-2 link-underline link-underline-opacity-0" href={'/forgot-password'}>Forgot password</Link>
                    </form>
                </div>
            </div>
        </>
    );
}