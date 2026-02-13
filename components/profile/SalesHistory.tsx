import Image from "next/image";

interface Sale {
    id: string;
    artTitle: string;
    artImage: string;
    buyerName: string;
    price: number;
    purchasedAt: string;
}

interface SalesHistoryProps {
    sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
    if (sales.length === 0) {
        return null;
    }

    return (
        <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
            <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6">
                Sales History
            </h2>
            <div className="space-y-4">
                {sales.map((sale) => (
                    <div
                        key={sale.id}
                        className="bg-cream-50 rounded-xl p-4 border border-beige-200 flex items-center gap-4"
                    >
                        <div className="relative h-16 w-16 flex-shrink-0 bg-beige-200 rounded-lg overflow-hidden">
                            {sale.artImage && (
                                <Image
                                    src={sale.artImage}
                                    alt={sale.artTitle}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-earth-brown-800">
                                {sale.artTitle}
                            </h3>
                            <p className="text-sm text-earth-brown-600">
                                Sold to: {sale.buyerName}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-earth-brown-800">
                                ₹{sale.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-earth-brown-600">
                                {new Date(sale.purchasedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
