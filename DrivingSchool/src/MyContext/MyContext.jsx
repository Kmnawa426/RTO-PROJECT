import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext'
export const MyContainer = createContext()
export default function MyContext({ children }) {
    const [students, setStudents]=useState()
    const token=localStorage.getItem("SchoolToken")
    const getStudents = () => {
        axios.get(`${host}/School/ViewStudents`,{headers:{"auth-token":token}})
        .then((res) => {
            console.log(res)
            setStudents(res.data.Students)
        }).catch((err) => {
            console.log(err)
            console.log(err?.response?.data?.message)
        });
    }
    useEffect(() => {
        getStudents()
    }, [])
    return (
        <div>
            <MyContainer.Provider value={{ students, setStudents,getStudents }} >
                {children}
            </MyContainer.Provider>
        </div >
    )
}
