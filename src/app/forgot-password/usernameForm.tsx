'use client';
import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import ResetPassForm from "./resetPassForm";
import Link from "next/link";

export default function usernameForms({accounts}:any) {

    const [isUser, setIsUser] = useState<boolean>(false);

    const router = useRouter();

    const userAccount = accounts?.items;

    if(!accounts){
        console.log('loadingg');
    }

    let userSchema = object({
        username: string().required("don't leave empty").test('user', 'User not found!', (user)=>{
            const acc = userAccount?.some((acc:any)=> acc?.username === user);
            
            return acc;
        }),
    });

    //username
    const formsUsername = useFormik({
        initialValues:{
            username: '',
        },
        validationSchema:userSchema,
        onSubmit: (values) =>{
            const user =userAccount?.find((account: any)=> account?.username === values.username);

            const username = user?.username;

            setIsUser(true);

            router.push(`/forgot-password?username=${username}`);
        }
    });

    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="mb-3">
            {isUser ? (
                <>
                    <ResetPassForm />
                </>
            ): (
                <div className="mb-3">
                    <div className="mb-3">
                        <h1>Password reset</h1>
                    </div>
                    <form onSubmit={formsUsername.handleSubmit}>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                id="username"
                                name="username"
                                value={formsUsername.values.username} 
                                onChange={formsUsername.handleChange} 
                                type="text"
                                placeholder="Type username" 
                            />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">reset</button>
                        </div>
                    </form>
                    {formsUsername.touched.username && formsUsername.errors.username ? (<div>{formsUsername.errors.username}</div>):null}  
                </div>
            )}
            <Link className="link-offset-2 link-underline link-underline-opacity-0" href={'/'}>home</Link>
        </div>
      </div>
    )
  }
  