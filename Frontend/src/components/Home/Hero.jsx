import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    const quotes = [
        "A book is a dream that you hold in your hand.",
        "It's never late to start reading",
        "Unleash your madness for knowledge.",
        "Empower your mind and shine bright.",
        "Dive into books, discover new worlds.",
        "Books: Your passport to adventure.",
    ];

    const [currentQuote, setCurrentQuote] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            // Start fade out
            setFade(false);

            setTimeout(() => {
                // Change quote and fade back in
                setCurrentQuote((prev) => (prev + 1) % quotes.length);
                setFade(true);
            }, 500); // Wait for fade out to complete

        }, 3000); // Change every 3 seconds

        return () => clearInterval(quoteInterval);
    }, [quotes.length]);

    return (
        <div className="h-[75vh] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
                <h1 className="text-4xl lg:text-5xl font-semibold text-yellow-100 text-center lg:text-left min-h-[100px] flex items-center">
                    <span className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
                        {quotes[currentQuote]}
                    </span>
                </h1>
                
                <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
                    Welcome Readers ...
                </p>

                <div className="mt-8 py-3">
                    <Link 
                        to="/books"
                        className="text-yellow-100 text-xl px-10 py-3 lg:text-2xl font-semibold border border-yellow-100 rounded-full hover:bg-yellow-100 hover:text-zinc-900 transition-all duration-300"
                    >
                        Explore Books
                    </Link>
                </div>
            </div>

            <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
                <img 
                    src="./logo.png"  
                    alt="Readook Logo" 
                    className="h-[300px] md:h-auto object-contain animate-pulse-slow" 
                />
            </div>
        </div>
    );
};

export default Hero;