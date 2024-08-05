"use client";
import { useEffect } from "react";

export default function bootstrapClient() {

    useEffect(()=>{
        require("bootstrap/dist/js/bootstrap.bundle.min.js")
    },[])

    return null;
};
