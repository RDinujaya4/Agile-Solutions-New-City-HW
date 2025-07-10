import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Banner Images
import banner1 from '../assets/Banner1.png';
import banner2 from '../assets/Banner2.png';
import banner3 from '../assets/Banner3.png';

// Category Images
import powerTools from '../assets/power-tools.png';
import handTools from '../assets/hand-tools.png';
import plumbing from '../assets/plumbing.png';
import electrical from '../assets/electrical.png';
import paints from '../assets/paints.png';
import fasteners from '../assets/fasteners.png';

function Home() {
  const [search, setSearch] = useState('');

  const categories = [
    { name: 'Power Tools', image: powerTools },
    { name: 'Hand Tools', image: handTools },
    { name: 'Plumbing', image: plumbing },
    { name: 'Electrical', image: electrical },
    { name: 'Paints', image: paints },
    { name: 'Fasteners', image: fasteners },
  ];

  return (
    <main className="text-slate-800">

  
      {/* Hero with Search */}
      <section className="bg-slate-100 py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-slate-900">
          Welcome to New City Hardware
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Your one-stop destination for quality tools, building materials, and hardware essentials.
        </p>

        {/* Search Bar with Icon */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <FiSearch className="absolute top-3.5 left-4 text-slate-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </section>


  {/* Slider Section */}
<section className="w-full bg-slate-100 px-4 py-8">
  <div className="max-w-8xl mx-auto overflow-hidden rounded-xl shadow-md">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      loop
      className="w-full h-56 sm:h-72 md:h-[400px]"
    >
      {[banner1, banner2, banner3].map((img, idx) => (
        <SwiperSlide key={idx}>
          <img
            src={img}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>
      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">Popular Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition border border-slate-200 overflow-hidden"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
              <div className="p-4 text-center">
                <h4 className="text-lg font-medium">{cat.name}</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Explore top-rated items in {cat.name.toLowerCase()}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
 {/* Our Services */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Expert Advice</h4>
            <p className="text-sm text-slate-600">Get guidance on choosing the right tools for your project.</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Custom Orders</h4>
            <p className="text-sm text-slate-600">We help you source special tools or bulk orders with ease.</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Fast Delivery</h4>
            <p className="text-sm text-slate-600">Get your hardware essentials delivered quickly and safely.</p>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-14 text-center px-4">
        <h3 className="text-2xl font-bold">Need help finding the right tool?</h3>
        <p className="mt-2">Visit our store or contact us for expert advice.</p>
        <button className="mt-4 px-6 py-2 bg-white text-blue-700 font-medium rounded-xl hover:bg-slate-100 transition">
          Contact Us
        </button>
      </section>

    </main>
  );
}

export default Home;
