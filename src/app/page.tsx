import Link from "next/link";

export default function login(){

  return( 
    <>
      <h1>HELLO, Welcome!</h1>
      <Link href={'/signin'}>Signin</Link>
      <Link href={'/signup'}>Signup</Link>
    </>
  );
}