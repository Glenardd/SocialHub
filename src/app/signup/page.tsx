import Signup from './signup';
import Link from 'next/link';

export default function page() {
  return (
    <>
        <Signup />
        <Link href={'/'}>home</Link>
    </>
  )
}
