 import React , {useState, useEffect} from "react";
import axiosInstance from "../../store/axios";
import Loader from "../Loader/loader.jsx";
import { NavLink } from "react-router-dom";
 
const AddedBooks = () => {
    const [Data, setData] = useState(null) ;
     const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resp = await axiosInstance.get("/book/get-added-books", {
                   headers: {
                    id: localStorage.getItem("id"),
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }) 
                console.log(resp);
                setData(resp.data.data)
                
            } catch (error) {
                console.log(error)
                setError("Failed to load books. Please try again later.");
            }
        }
        fetchBooks();
    },[])
    return (
        <div className="bg-zinc-900 min-h-screen py-8 px-12">
            <h4 className="text-3xl font-semibold text-zinc-500">
                Added Books
            </h4>
            {!Data && <div className="flex items-center justify-center my-8"> 
                    <Loader /> 
                </div>}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center">
                {Data && Data.length === 0 && (
                      <div className="text-xl items-centre justify-center">
                          <h2 className="text-zinc-300 m-5 mb-3 font-semibold"> No Books Added  </h2>
                          <NavLink
                            to = "/profile/addBooks"
                            className="rounded mt-8 m-5 underline text-yellow-50">
                            Add Books
                          </NavLink> 
                      </div>
                  )}
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

export default AddedBooks ;