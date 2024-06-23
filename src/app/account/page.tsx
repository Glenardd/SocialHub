import Accounts from "./account";
import UserNav from "../userNav";
import { cookies } from "next/headers";

export default function User() {

    const user = cookies().get("isLogged")?.value;
    
    return (
        <>
            
            <UserNav />
            <Accounts user={user}/>
        </>
    );
}
