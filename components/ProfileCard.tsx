import Image from "next/image";

interface ProfileProps {
    avatar: string;
    name: string;
    bio: string;
    role: "Artist" | "Buyer";
    isOwnProfile?: boolean;
    onEditBio?: () => void;
    onUploadAvatar?: () => void;
}

const ProfileCard = ({ avatar, name, bio, role, isOwnProfile = false, onEditBio, onUploadAvatar }: ProfileProps) => {
    return (
        <div className="bg-beige-100 rounded-[2.5rem] shadow-xl border-2 border-beige-200/50 overflow-hidden max-w-2xl mx-auto">
            {/* Cover Backdrop */}
            <div className="h-40 bg-linear-to-br from-earth-brown-700 to-earth-brown-900 tribal-pattern"></div>

            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-16 mb-6">
                    {/* Avatar */}
                    <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-beige-100 shadow-lg bg-beige-100 group">
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
                        {isOwnProfile && onUploadAvatar && (
                            <button
                                onClick={onUploadAvatar}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        )}
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
                    {isOwnProfile && (
                        <div className="pt-4">
                            <button 
                                onClick={onEditBio}
                                className="w-full bg-earth-brown-800 text-cream-50 py-3 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all hover:shadow-beige-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Bio
                            </button>
                        </div>
                    )}
                    {!isOwnProfile && (
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-earth-brown-800 text-cream-50 py-3 rounded-xl font-bold shadow-lg hover:bg-earth-brown-900 transition-all hover:shadow-beige-200">
                                Follow
                            </button>
                            <button className="flex-1 bg-cream-50 text-earth-brown-800 border border-beige-200 py-3 rounded-xl font-bold hover:bg-beige-200 transition-all">
                                Message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
