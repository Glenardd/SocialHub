'use client';
import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";

export default function usernameForms({accounts}:any) {

    const [username, setUserName] = useState<any>('');
    const [passChange, setPassChange] = useState<boolean>(false);

    const userAccount = accounts?.items;

    if(!accounts){
        console.log('loadingg');
    }

    let userSchema = object({
        username: string().required("don't leave empty").test('username', 'User not found!', (user)=>{
            const acc = userAccount?.some((acc:any)=> acc?.username !== user);

            return !acc;
        }),
    })

    let passSchema = object({
        password: string().required("don't leave empty"),
    })

    //username
    const formsUsername = useFormik({
        initialValues:{
            username: '',
        },
        validationSchema:userSchema,
        onSubmit: (values) =>{
            const user =userAccount?.find((account: any)=> account?.username === values.username);

            const username = user?.username;

            setUserName(username);
        }
    });

    //password
    const formsPassword = useFormik({
        initialValues:{
            password: '',
        },
        validationSchema:passSchema,
        onSubmit: (values) =>{
            
            const data = {
                "password": values.password,
            }

            const user =userAccount?.find((account: any)=> account?.username === username);

            const userId = user?.id;

            fetch(`http://127.0.0.1:8090/api/collections/accounts/records/${userId}`,{
                method: "PATCH",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            //indicates password changed
            setPassChange(true);
            setTimeout(() => {
                setPassChange(false);
            }, 800);
            
        }
    });

    return (
      <>
        <h1>Password recover</h1>
        {
            //hide the form if username is not undefined
            username === '' &&
            (
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
            )
        }
        {
            //show the form if username is not undefined
            username !== '' && 
            (
                <>
                    <h2>Account: {username}</h2>
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
                    {passChange && <h2>Password change</h2>}
                </>
            )
        }
      </>
    )
  }
  