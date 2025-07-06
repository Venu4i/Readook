import React from "react";
import {Link} from "react-router-dom";

const BookCard = ({data}) => {
    return (
        <>
        <Link to = {`/get-book-details/${data._id}`}>
        <div className=" bg-zinc-800 rounded p-4 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300">
            <div className="bg-zinc-900 rounded flex items-center justify-center">
                <img src={data.url} alt="/" className="h-[25vh]" />
            </div>
            <h2 className = "mt-4 text-white text-xl font-semibold"> {data.title} </h2>
            <p className = "mt-2 text-zinc-400 font-semibold"> Author: {data.author} </p>
            <p className = "mt-2 text-zinc-400 font-semibold"> Price: {data.price} INR</p>
        </div>
        </Link>
        </>
    )
}

export default BookCard