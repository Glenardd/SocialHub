import React from 'react'
import Search from './search';

export default function page({ params }:any) {
  return (
    <>
        <Search params={params}/>
    </>
  )
}
