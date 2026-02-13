export default function ProfileSkeleton() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-cream-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="mb-12 text-center animate-pulse">
                    <div className="h-4 bg-beige-200 rounded w-32 mx-auto mb-2"></div>
                    <div className="h-8 bg-beige-200 rounded w-64 mx-auto"></div>
                </div>

                {/* Profile Card Skeleton */}
                <div className="bg-beige-100 rounded-[2.5rem] shadow-xl border-2 border-beige-200/50 overflow-hidden max-w-2xl mx-auto mb-12 animate-pulse">
                    <div className="h-40 bg-beige-300"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-16 mb-6">
                            <div className="h-32 w-32 bg-beige-300 rounded-2xl"></div>
                            <div className="h-8 w-20 bg-beige-300 rounded-full mb-2"></div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="h-8 bg-beige-200 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-beige-200 rounded w-32"></div>
                            </div>
                            <div className="bg-cream-50/50 rounded-2xl p-6 border border-beige-200">
                                <div className="h-3 bg-beige-200 rounded w-16 mb-2"></div>
                                <div className="h-4 bg-beige-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-beige-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                        <div className="h-4 bg-beige-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-beige-200 rounded w-16"></div>
                    </div>
                    <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                        <div className="h-4 bg-beige-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-beige-200 rounded w-16"></div>
                    </div>
                    <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
                        <div className="h-4 bg-beige-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-beige-200 rounded w-16"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
