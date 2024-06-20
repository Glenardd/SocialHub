import Link from 'next/link';
import Forms from './forms';

export default function page() {
  return (
    <>
      <Forms />
      <Link href={'/'}>home</Link>
    </>
  )
}
