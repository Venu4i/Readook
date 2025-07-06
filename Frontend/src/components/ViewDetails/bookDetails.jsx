import React from "react";
import axios from "axios";

import Loader from "../Loader/loader";
import { GrLanguage } from "react-icons/gr";
import { MdCurrencyRupee } from "react-icons/md";


import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
    const {id} = useParams(); // Extracting the book ID from the URL parameters
    console.log("Book ID:",id); // debugging 
        const [Data, setData] = useState(null) ;
         const [error, setError] = useState(null);
    
        useEffect(() => {
            const fetchBooks = async () => {
                try {
                    const resp = await axios.get(`http://localhost:3000/api/v1/book/get-book-details/${id}`)
                    setData(resp.data.data)
                    
                } catch (error) {
                    console.log(error)
                    setError("Failed to load books. Please try again later.");
                }
            }
            fetchBooks()
        },[])
    return (
        <>
        {Data && (
            <div className="bg-zinc-900 flex flex-col md:flex-row  gap-8 py-8 px-5 md:px-12"  >
            <div className="bg-zinc-800 rounded p-4 h-[60vh] md:h-[80vh] w-full lg:w-3/6 flex items-center justify-center"> 
                 <img src = {Data.url} 
                      alt = "Book Cover" 
                      className="h-[50vh] lg:h-[70vh]" />
            </div>
            <div className=" w-full lg:w-3/6 p-4 ">
                <h2 className="text-3xl text-yellow-100 font-semibold"> {Data.title} </h2>
                <p className="mt-1 text-zinc-400 text-xl  "> By: {Data.author} </p>
                <p className="mt-4  text-xl text-zinc-400"> {Data.description} </p>
                
                <p className="mt-2 text-zinc-400 text-xl flex "><GrLanguage className="me-3 mt-1" /> {Data.language} </p>
                <p className="mt-2 text-zinc-300 text-xl flex "> Price:<MdCurrencyRupee className=" ml-1 mt-1"/>{Data.price} </p>
                
            </div>
        </div>
        )}
        {!Data && (<div className ="h-screen bg-zinc-900 flex items-center justify-center">
            <Loader />
            </div>)}
        </>
    )

}

// export default bookDetails //must start with uppercase in jsx
export default BookDetails