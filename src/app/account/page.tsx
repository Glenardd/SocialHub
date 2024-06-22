import Accounts from "./account";
import UserNav from "../userNav";
import Search from "./user/search";

export default function User() {

    return (
        <>
            <UserNav />
            <Search />
            <Accounts />
        </>
    );
}
