import React from "react";
import axios from 'axios';

import { useEffect } from "react";
import { useState } from "react";

import BookCard from "../BookCard/BookCard.jsx";
import Loader from "../Loader/loader.jsx";


const RecentlyAdded = () => {
    const [Data, setData] = useState(null) ;
     const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resp = await axios.get(`http://localhost:3000/api/v1/book/get-recent-books`)
                setData(resp.data.data)
                
            } catch (error) {
                console.log(error)
                setError("Failed to load books. Please try again later.");
            }
        }
        fetchBooks()
    },[])

    return (
        <div className="mt-8 px-4">
            <h4 className="text-3xl text-yellow-100">
                Recently added Books
            </h4>
            {!Data && <div className="flex items-center justify-center my-8"> 
                    <Loader /> 
                </div>}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Data && Data.length >0 && Data.map((items,i) => (
                    <div key = {i} >
                        <BookCard data = {items} /> {" "}
                    </div>
                ))}
                  </div>
            </div>
    )
}

export default RecentlyAdded;