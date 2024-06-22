import Result from './result';
import Search from "../user/search";
import UserNav from "../../userNav";

export default function page() {
  return (
    <>
      <UserNav />
      <Search />
      <Result />
    </>
  )
}
