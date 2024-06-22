"use client";
import React, { useState } from "react"
import { useSearchParams } from "next/navigation";
import { object, string } from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

export default function resetPassForm() {

    const [passChanged, setPassChanged] = useState<boolean>(false);

    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());
    
    const accounts = useSWR('http://127.0.0.1:8090/api/collections/accounts/records', fetcher, {revalidateOnFocus: false}).data;

    const userAccount = accounts?.items;

    const params = useSearchParams();

    const user = params.get("username");

    const router = useRouter();
    
    let passSchema = object({
        password: string().required("don't leave empty"),
    })

    const formsPassword = useFormik({
        initialValues:{
            password: "",
        },
        validationSchema:passSchema,
        onSubmit: (values) =>{
            
            const data = {
                "password": values.password,
            }

            const username =userAccount?.find((account: any)=> account?.username === user);

            const userId = username?.id;

            fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            setPassChanged(true);
        }
    });

    return (
        <>  
            {
                passChanged ? (
                    <>
                        <h2>Password changed.</h2>
                        <Link href={"/"}>signin</Link>
                    </>
                ) : (
                    <>
                        <h2>Account: {user}</h2>
                        <form onSubmit={formsPassword.handleSubmit}>
                                <label htmlFor="password">New password:</label>
                                <input
                                    id="password"
                                    name="password"
                                    value={formsPassword.values.password} 
                                    onChange={formsPassword.handleChange} 
                                    type="text" 
                                />
                            <button type="submit">reset</button>
                        </form>
                        {formsPassword.touched.password && formsPassword.errors.password ? (<div>{formsPassword.errors.password}</div>):null}
                    </>
                )
            }
        </>
    )
}
