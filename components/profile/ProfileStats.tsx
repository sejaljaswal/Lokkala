interface ProfileStatsProps {
    role: "artist" | "buyer";
    stats: {
        listingsCount?: number;
        salesCount?: number;
        totalSales?: number;
        purchaseCount?: number;
        totalSpent?: number;
    };
}

export default function ProfileStats({ role, stats }: ProfileStatsProps) {
    if (role === "artist") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                    <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">
                        Total Listings
                    </h3>
                    <p className="text-4xl font-extrabold text-earth-brown-800">
                        {stats.listingsCount ?? 0}
                    </p>
                </div>
                <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                    <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">
                        Total Sales
                    </h3>
                    <p className="text-4xl font-extrabold text-earth-brown-800">
                        {stats.salesCount ?? 0}
                    </p>
                </div>
                <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                    <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">
                        Revenue
                    </h3>
                    <p className="text-4xl font-extrabold text-earth-brown-800">
                        ₹{(stats.totalSales ?? 0).toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }

    // Buyer stats
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">
                    Total Purchases
                </h3>
                <p className="text-4xl font-extrabold text-earth-brown-800">
                    {stats.purchaseCount ?? 0}
                </p>
            </div>
            <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                <h3 className="text-sm font-bold text-earth-brown-600 uppercase tracking-widest mb-2">
                    Total Spent
                </h3>
                <p className="text-4xl font-extrabold text-earth-brown-800">
                    ₹{(stats.totalSpent ?? 0).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
