import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-beige-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 tribal-pattern"></div>
        <div className="flex-1 space-y-8 text-center lg:text-left relative z-10">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-earth-brown-800 leading-tight">
            Preserving Traditions, <br />
            <span className="text-earth-brown-600 italic">One Masterpiece</span> at a Time.
          </h1>
          <p className="text-xl text-earth-brown-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Discover a curated collection of authentic tribal art, handcrafted by master artisans. Join our community to support culture and creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/shop"
              className="bg-earth-brown-800 text-cream-50 px-8 py-4 rounded-full font-bold text-lg hover:bg-earth-brown-900 transition-all shadow-xl hover:shadow-beige-200 transform hover:-translate-y-1"
            >
              Explore the Shop
            </Link>
            <Link
              href="/signup"
              className="bg-beige-200 text-earth-brown-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-beige-300 transition-all border border-beige-300"
            >
              Become an Artist
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-lg lg:max-w-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-beige-200 to-transparent rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-beige-100 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000&auto=format&fit=crop"
              alt="Tribal Art Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges / Stats Section */}
      <section className="w-full bg-beige-100 py-12 border-y-4 border-earth-brown-800/10 tribal-pattern">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 lg:gap-24 relative z-10">
          <div className="text-center bg-cream-50/80 backdrop-blur-sm p-8 rounded-3xl border border-beige-200 shadow-sm transform -rotate-2">
            <p className="text-4xl font-extrabold text-earth-brown-800">500+</p>
            <p className="text-earth-brown-600 font-bold uppercase tracking-widest text-xs mt-1">Artisans</p>
          </div>
          <div className="text-center bg-cream-50/80 backdrop-blur-sm p-8 rounded-3xl border border-beige-200 shadow-sm transform rotate-1">
            <p className="text-4xl font-extrabold text-earth-brown-800">2.5k+</p>
            <p className="text-earth-brown-600 font-bold uppercase tracking-widest text-xs mt-1">Masterpieces</p>
          </div>
          <div className="text-center bg-cream-50/80 backdrop-blur-sm p-8 rounded-3xl border border-beige-200 shadow-sm transform -rotate-1">
            <p className="text-4xl font-extrabold text-earth-brown-800">10k+</p>
            <p className="text-earth-brown-600 font-bold uppercase tracking-widest text-xs mt-1">Collectors</p>
          </div>
        </div>
      </section>
    </main>
  );
}
