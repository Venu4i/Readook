import React from "react";
import Hero from "../components/Home/Hero.jsx";
import RecentlyAdded from "../components/Home/recentlyAdded.jsx";

const Home = () => {
    return (
    <>
        <div className="w-full bg-zinc-900 px-10 py-8 text-white">
            <Hero />
            <RecentlyAdded/>
        </div>
    </>
    )
}

export default Home;