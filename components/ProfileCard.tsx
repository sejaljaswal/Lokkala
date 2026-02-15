import Image from "next/image";

interface ProfileProps {
    avatar: string;
    name: string;
    bio: string;
    role: "Artist" | "Buyer";
}

const ProfileCard = ({ avatar, name, bio, role }: ProfileProps) => {
    return (
        <div className="bg-beige-100 rounded-[2.5rem] shadow-xl border-2 border-beige-200/50 overflow-hidden max-w-2xl mx-auto transform -rotate-1">
            {/* Cover Backdrop */}
            <div className="h-40 bg-linear-to-br from-earth-brown-700 to-earth-brown-900 tribal-pattern"></div>

            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-16 mb-6">
                    {/* Avatar */}
                    <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-beige-100 shadow-lg bg-beige-100">
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                            unoptimized={true}
                        />
                    </div>

                    {/* Role Badge */}
                    <div className="mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm ${role === "Artist"
                            ? "bg-earth-brown-800 text-cream-50"
                            : "bg-beige-200 text-earth-brown-800"
                            }`}>
                            {role}
                        </span>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-earth-brown-900 leading-tight">
                            {name}
                        </h1>
                        <p className="text-earth-brown-600 font-medium">@{name.toLowerCase().replace(/\s+/g, '')}</p>
                    </div>

                    <div className="bg-cream-50/50 rounded-2xl p-6 border border-beige-200">
                        <h3 className="text-sm font-bold text-earth-brown-400 uppercase tracking-widest mb-2">About</h3>
                        <p className="text-earth-brown-800 leading-relaxed text-lg italic">
                            &quot;{bio}&quot;
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button className="flex-1 bg-earth-brown-800 text-cream-50 py-3 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all hover:shadow-beige-200">
                            Follow
                        </button>
                        <button className="flex-1 bg-cream-50 text-earth-brown-800 border border-beige-200 py-3 rounded-xl font-bold hover:bg-beige-200 transition-all">
                            Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
