"use client";
import { useFormik } from "formik";
import { object, string } from "yup";
import useSWR, {mutate} from "swr";
import { useRouter } from "next/navigation";

export default function Signup(){

    const router = useRouter();
    
    const fetcher = (...args: [RequestInfo, RequestInit]) => fetch(...args).then((res) => res.json());

    const { data } = useSWR( 'http://127.0.0.1:8090/api/collections/accounts/records',fetcher, {revalidateOnFocus: false,});

    if (!data){
        console.log('loading');
    }

    const userAccounts = data?.items;

    let userSchema = object({
        username: string().required("don't leave empty").test('username', 'Username already used!', (username)=> {
            const isUsernameTaken = userAccounts?.some((account: any) => account.username === username);
            
            return !isUsernameTaken;

        }).required("don't leave empty").min(5, 'Please give 5 characters long').max(15, 'Username is too long, 15 characters only'),
        password: string().required("don't leave empty").min(8, 'Password should be 8 characters long'),
    });

    const forms = useFormik({
        initialValues:{
            username: '',
            password: '',
        },
        validationSchema: userSchema,
        onSubmit: (values) =>{

            //create a json for changes
            const data = {
                "username": values.username,
                "password": values.password,
                "isLogged": false,
            }

            //create a http request
            const postUser = async () => {
                await fetch('http://127.0.0.1:8090/api/collections/accounts/records',{
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                //to save changes
                mutate('http://127.0.0.1:8090/api/collections/accounts/records');
            }

            postUser();

            const isUsernameTaken = userAccounts.some((acc:any) => acc.username === values.username);
            if (isUsernameTaken) {
                //show the warning from yup
            } else {
                //redirect if account is not in the database
                router.push("/"); 
            };
        },
    });

    return(
        <>
            <h1>Sign up</h1>
            <form onSubmit={forms.handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username" 
                    type="text"
                    onChange={forms.handleChange}
                    value={forms.values.username} 
                />
                {forms.touched.username && forms.errors.username ? (<div>{forms.errors.username}</div>):null}

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password" 
                    type="text"
                    onChange={forms.handleChange}
                    value={forms.values.password} 
                />
                {forms.touched.password && forms.errors.password ? (<div>{forms.errors.password}</div>):null}
                <button type="submit">Create account</button>
            </form>
        </>
    );
}