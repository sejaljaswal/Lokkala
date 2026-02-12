import Image from "next/image";

interface ProductCardProps {
    image: string;
    title: string;
    artistName: string;
    price: number;
}

const ProductCard = ({ image, title, artistName, price }: ProductCardProps) => {
    return (
        <div className="group relative bg-beige-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-beige-200/50 hover:border-earth-brown-800/20 flex flex-col h-full transform hover:-rotate-1">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-beige-200 m-2 rounded-[1.5rem]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-earth-brown-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-cream-50 text-earth-brown-800 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        View Details
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-1">
                    <p className="text-xs font-semibold text-earth-brown-600 uppercase tracking-wider">
                        {artistName}
                    </p>
                </div>
                <h3 className="text-lg font-bold text-earth-brown-800 line-clamp-1 mb-2">
                    {title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-extrabold text-earth-brown-900">
                        ${price.toLocaleString()}
                    </span>
                    <button className="p-2 rounded-full bg-cream-50 text-earth-brown-600 hover:bg-earth-brown-800 hover:text-cream-50 transition-colors duration-300 border border-beige-200">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
