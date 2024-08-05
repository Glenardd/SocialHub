"use client";
import { useFormik } from "formik"
import { useRouter } from "next/navigation";

export default function search() {

    const router = useRouter();

    const searchForms = useFormik({
        initialValues:{
            search: '',
        },
        onSubmit: (values) =>{
            if(values.search === ""){
                //do nothing
            }else{
                router.push(`/account/result?search=${values.search}`);
            }
        },
    });

    return (
        <>
            <form onSubmit={searchForms.handleSubmit}>
                <div>
                <input 
                    type="search"
                    name="search"
                    placeholder="search"
                    value={searchForms.values.search}
                    onChange={searchForms.handleChange} 
                />
                <button type='submit' className="btn btn-primary mx-2">search</button>
                </div>
            </form>
        </>
    )
}
