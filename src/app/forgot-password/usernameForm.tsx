'use client';
import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function usernameForms({accounts}:any) {

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

            router.push(`/forgot-password/user?username=${username}`);
        }
    });

    return (
      <>
        <h1>Password reset</h1>
        <>
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
      </>
    )
  }
  