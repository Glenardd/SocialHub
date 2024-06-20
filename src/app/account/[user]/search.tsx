'use client';
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Result from './result';

export default function search({ params }:any) {

  const searchResult = params?.user;

  const router = useRouter();

  const searchForm = useFormik({
    initialValues:{
      search: '',
    },
    onSubmit: (values)=>{
      const data = {
        "search": values.search,
      }

      // alert(JSON.stringify(data, null,2));

      router.push(`/account/${values.search}`);
    },
  });

  console.log(JSON.stringify(router));

  return (
    <>
        <form onSubmit={searchForm.handleSubmit}>
            <input 
              type="search"
              name="search" 
              placeholder='search'
              value={searchForm.values.search}
              onChange={searchForm.handleChange}
            />
            <button type="submit">search</button>
        </form>
        <Result searchResult={searchResult}/>
    </>
  )
}
