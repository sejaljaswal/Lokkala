import Image from "next/image";
import Link from "next/link";

interface Listing {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
    createdAt: string;
}

interface ProfileListingsProps {
    listings: Listing[];
}

export default function ProfileListings({ listings }: ProfileListingsProps) {
    if (listings.length === 0) {
        return (
            <div className="bg-beige-100 rounded-3xl p-12 border-2 border-beige-200 shadow-xl text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-extrabold text-earth-brown-800">
                        No Listings Yet
                    </h3>
                    <p className="text-earth-brown-600">
                        Share your creativity with the world. Upload your first artwork to get started!
                    </p>
                    <Link
                        href="/upload"
                        className="inline-block mt-6 bg-earth-brown-800 text-cream-50 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all"
                    >
                        Upload Your First Artwork
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-beige-100 rounded-3xl p-8 border-2 border-beige-200 shadow-xl">
            <h2 className="text-2xl font-extrabold text-earth-brown-800 mb-6">
                My Art Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((art) => (
                    <div
                        key={art.id}
                        className="bg-cream-50 rounded-xl overflow-hidden border border-beige-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-48 bg-beige-200">
                            <Image
                                src={art.imageUrl}
                                alt={art.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-earth-brown-800 truncate">
                                {art.title}
                            </h3>
                            <p className="text-sm text-earth-brown-600">{art.category}</p>
                            <p className="text-lg font-bold text-earth-brown-800 mt-2">
                                ₹{art.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
