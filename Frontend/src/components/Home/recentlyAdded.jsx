import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

const RecentlyAdded = () => {
    const [Books, setBooks] = useState() ;

    useEffect(() => {
        const fetch = async () => {
            const resp = await axios.get("http://localhost:3000/api/v1/book/get-recent-books")
            console.log(resp);
        }
        fetch();
    },[])

    return (
        <div className="mt-8 px-4">
            <h4 className="text-3xl text-yellow-100">
                Recently added Books
            </h4>
        </div>
    )
}

export default RecentlyAdded;