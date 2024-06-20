import Signin from './signIn';
import Link from 'next/link';

export default function Login(){

    return(
        <>
            <Signin /> 
            <Link href={'/forgot-password'}>Forgot password</Link>
            <Link href={'/'}>home</Link> 
        </>
    );
}