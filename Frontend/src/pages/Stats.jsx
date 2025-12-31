import React, { useEffect, useState } from "react";
import axiosInstance from "../store/axios.js";
import Loader from "../components/Loader/loader.jsx";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
    PiBookOpenDuotone, PiUsersDuotone, 
    PiPackageDuotone, PiTrendUpDuotone, PiCurrencyInrBold 
} from "react-icons/pi";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get("/admin/get-stats", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            // Matching your provided response structure: response.data.data
            setData(response.data.data);
            console.log("Admin Stats Data:", response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className="bg-zinc-900 min-h-screen flex items-center justify-center"><Loader /></div>;

    const { stats, chartData, recentOrders } = data;

    return (
        <div className="bg-zinc-900 min-h-screen py-8 px-6 md:px-12 text-white">
            <h4 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Admin Dashboard</h4>

            {/* 1. Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <StatCard title="Total Books" value={stats.totalBooks} icon={<PiBookOpenDuotone className="text-blue-400" />} />
                <StatCard title="Total Users" value={stats.totalUsers} icon={<PiUsersDuotone className="text-green-400" />} />
                <StatCard title="Sellers" value={stats.totalSellers} icon={<PiUsersDuotone className="text-purple-400" />} />
                <StatCard title="Orders" value={stats.totalOrders} icon={<PiPackageDuotone className="text-orange-400" />} />
                <StatCard title="Revenue" value={`${stats.totalRevenue}`} icon={<PiCurrencyInrBold className="text-yellow-100" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Order Analytics Graph */}
                <div className="lg:col-span-2 bg-zinc-800 p-6 rounded-lg border border-zinc-700">
                    <div className="flex items-center mb-6">
                        <PiTrendUpDuotone className="text-yellow-100 text-3xl mr-2" />
                        <h2 className="text-2xl font-semibold">Order Growth</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                <XAxis dataKey="month" stroke="#a1a1aa" />
                                <YAxis stroke="#a1a1aa" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fef9c3' }}
                                />
                                <Bar dataKey="orders" fill="#fef9c3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Recent Orders List */}
                <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4 border-b border-zinc-700 pb-2">Recent Orders</h2>
                    <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-md border border-zinc-800">
                                <div>
                                    <p className="text-sm font-medium text-zinc-100 truncate w-32 md:w-full">{order.book.title}</p>
                                    <p className="text-xs text-zinc-500">by {order.user.username}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-yellow-100">₹{order.book.price}</p>
                                    <p className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                                        order.status === 'delivered' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                                    }`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-zinc-800 p-5 rounded-lg border border-zinc-700 flex items-center justify-between">
        <div>
            <p className="text-zinc-500 text-xs uppercase font-bold">{title}</p>
            <h2 className="text-2xl font-bold text-white">{value}</h2>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
    </div>
);

export default AdminDashboard;