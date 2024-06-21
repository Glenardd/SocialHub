'use client';
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import Result from './result';

export default function search() {
  
  const params = useSearchParams();
  const query = params.get('q');

  const router = useRouter();

  const searchForm = useFormik({
    initialValues:{
      search: '',
    },
    onSubmit: (values)=>{
      if(values.search === ""){
        //do nothing
      }else{
        router.push(`/account/user?q=${values.search}`);
      }
    },
  });

  return (
    <>
        <form onSubmit={searchForm.handleSubmit}>
            <input 
              type="search"
              name="search" 
              placeholder="search user"
              value={searchForm.values.search}
              onChange={searchForm.handleChange}
            />
            <button type="submit">search</button>
        </form>
        <Result searchResult={query}/>
    </>
  )
}
