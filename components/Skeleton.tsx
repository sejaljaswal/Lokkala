export const ProductCardSkeleton = () => {
    return (
        <div className="bg-beige-100 rounded-4xl overflow-hidden shadow-sm border-2 border-beige-200/50 flex flex-col h-full">
            <div className="relative aspect-4/5 overflow-hidden bg-beige-200 m-2 rounded-3xl animate-shimmer" />
            <div className="p-5 flex flex-col grow space-y-3">
                <div className="h-3 bg-beige-200 rounded-full animate-shimmer w-1/3" />
                <div className="h-5 bg-beige-200 rounded-full animate-shimmer w-3/4" />
                <div className="mt-auto flex items-center justify-between">
                    <div className="h-6 bg-beige-200 rounded-full animate-shimmer w-1/3" />
                    <div className="flex gap-2">
                        <div className="w-10 h-10 bg-beige-200 rounded-full animate-shimmer" />
                        <div className="w-10 h-10 bg-beige-200 rounded-full animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfileStatSkeleton = () => {
    return (
        <div className="bg-beige-100 rounded-2xl p-6 border-2 border-beige-200 shadow-lg">
            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-1/2 mb-4" />
            <div className="h-10 bg-beige-200 rounded-full animate-shimmer w-2/3" />
        </div>
    );
};

export const ArtListingSkeleton = () => {
    return (
        <div className="bg-cream-50 rounded-xl overflow-hidden border border-beige-200">
            <div className="relative h-48 bg-beige-200 animate-shimmer" />
            <div className="p-4 space-y-2">
                <div className="h-5 bg-beige-200 rounded-full animate-shimmer w-3/4" />
                <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-1/2" />
                <div className="h-6 bg-beige-200 rounded-full animate-shimmer w-1/3 mt-2" />
            </div>
        </div>
    );
};

export const OrderCardSkeleton = () => {
    return (
        <div className="bg-beige-100 rounded-3xl p-6 border-2 border-beige-200 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 bg-beige-200 rounded-xl animate-shimmer" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-beige-200 rounded-full animate-shimmer w-3/4" />
                    <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-1/2" />
                    <div className="h-5 bg-beige-200 rounded-full animate-shimmer w-1/3" />
                </div>
            </div>
        </div>
    );
};

export const CartItemSkeleton = () => {
    return (
        <div className="bg-beige-100 rounded-3xl border-2 border-beige-200 shadow-lg overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-32 h-40 sm:h-32 shrink-0 rounded-2xl bg-beige-200 animate-shimmer" />
                <div className="grow space-y-3 flex-1">
                    <div className="h-6 bg-beige-200 rounded-full animate-shimmer w-3/4" />
                    <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-1/2" />
                    <div className="h-8 bg-beige-200 rounded-full animate-shimmer w-1/3" />
                </div>
            </div>
        </div>
    );
};

export const ProductDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb Skeleton */}
                <div className="mb-8 flex gap-2">
                    <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-20" />
                    <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-20" />
                    <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Skeleton */}
                    <div className="relative aspect-square bg-beige-200 rounded-3xl animate-shimmer" />

                    {/* Details Skeleton */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-3">
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-24" />
                            <div className="h-10 bg-beige-200 rounded-full animate-shimmer w-full" />
                            <div className="h-8 bg-beige-200 rounded-full animate-shimmer w-32" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-full" />
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-5/6" />
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-4/6" />
                        </div>
                        <div className="bg-beige-100 rounded-2xl p-6 space-y-3">
                            <div className="h-5 bg-beige-200 rounded-full animate-shimmer w-32" />
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-full" />
                            <div className="h-4 bg-beige-200 rounded-full animate-shimmer w-full" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 h-14 bg-beige-200 rounded-full animate-shimmer" />
                            <div className="w-14 h-14 bg-beige-200 rounded-full animate-shimmer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
