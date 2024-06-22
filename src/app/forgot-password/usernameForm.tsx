'use client';
import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import ResetPassForm from "./resetPassForm";

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
      <>
        {isUser ? (
            <>
                <ResetPassForm />
            </>
        ): (
            <>
                <h1>Password reset</h1>
                <form onSubmit={formsUsername.handleSubmit}>
                        <label htmlFor="username">Type your username</label>
                        <input
                            id="username"
                            name="username"
                            value={formsUsername.values.username} 
                            onChange={formsUsername.handleChange} 
                            type="text" 
                        />
                    <button  type="submit">reset</button>
                </form>
                {formsUsername.touched.username && formsUsername.errors.username ? (<div>{formsUsername.errors.username}</div>):null}  
            </>
        )}
      </>
    )
  }
  