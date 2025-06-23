import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="h-[75vh] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
               <h1 className="text-4xl font-semibold text-yellow-100 text-center lg:text-left">
                Rolling Quotes

               </h1>
               <p className="mt:4 text-xl text-zinc-300 text-center lg:text-left ">
                Unlease your madness
               </p>
               <div className="mt-8 py-3">
                <Link 
                to ="/books"
                className="text-yellow-100 text-xl px-2 lg:text-2xl font-semibold border border-yellow-100 rounded-2xl">
                  Explore Books</Link>
               </div>
            </div>
            <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
              <img 
              src = " " 
              alt = "display"  />
            </div>
        </div>
    )
}

export default Hero