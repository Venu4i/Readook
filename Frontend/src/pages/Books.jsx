import React from "react";
import axios from 'axios';

import { useEffect } from "react";
import { useState } from "react";

import BookCard from "../components/BookCard/BookCard.jsx";
import Loader from "../components/Loader/loader.jsx";
import axiosInstance from "../store/axios.js";

const Books = () => {
    const [Data, setData] = useState([]) ;
     const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resp = await axiosInstance.get("http://localhost:3000/api/v1/book/get-all-books")
                setData(resp.data.data)
                
            } catch (error) {
                console.log(error)
                setError("Failed to load books. Please try again later.");
            }
        }
        fetchBooks()
    },[])
    return (
        <div className="bg-zinc-900 h-auto py-8 px-12">
            <h4 className="text-3xl font-semibold text-yellow-100">
                Available Books
            </h4>
            {!Data && <div className="flex items-center justify-center my-8"> 
                    <Loader /> 
                </div>}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {Data && Data.length >0 && Data.map((items,i) => (
                    // console.log(items),
                    <div key = {i} >
                        <BookCard data = {items} /> {" "}
                    </div>
                ))}
                  </div>
        </div>
    )
}

export default Books