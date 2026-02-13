import Image from "next/image";

interface Purchase {
    id: string;
    artTitle: string;
    artImage: string;
    artCategory: string;
    artistName: string;
    price: number;
    purchasedAt: string;
}

interface PurchaseHistoryProps {
    purchases: Purchase[];
}

export default function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
    if (purchases.length === 0) {
        return (
            <div className="bg-beige-100 rounded-3xl p-12 border-2 border-beige-200 shadow-xl text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-extrabold text-earth-brown-800">
                        No Purchases Yet
                    </h3>
                    <p className="text-earth-brown-600">
                        Start collecting unique artworks from talented artists!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
            <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6">
                My Collection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => (
                    <div
                        key={purchase.id}
                        className="bg-cream-50 rounded-xl overflow-hidden border border-beige-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-48 bg-beige-200">
                            <Image
                                src={purchase.artImage}
                                alt={purchase.artTitle}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-earth-brown-800 truncate">
                                {purchase.artTitle}
                            </h3>
                            <p className="text-sm text-earth-brown-600">
                                by {purchase.artistName}
                            </p>
                            <p className="text-sm text-earth-brown-500">
                                {purchase.artCategory}
                            </p>
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-lg font-bold text-earth-brown-800">
                                    ₹{purchase.price.toLocaleString()}
                                </p>
                                <p className="text-xs text-earth-brown-600">
                                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
