import Link from "next/link";
import Signin from './signIn'


export default function login(){

  return( 
    <>
      <h1>HELLO, Welcome!</h1>

      <Signin />
      <Link href={'/signup'}>Signup</Link>
      <Link href={'/forgot-password'}>Forgot password</Link>
    </>
  );
}