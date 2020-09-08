import React,{useEffect} from 'react'
import {Redirect} from 'react-router-dom'

export default function Logout({signout}){

    useEffect(() => {
        signout();
    },[])

    return(<Redirect to="/"/>);
}