import { useState } from 'react';
import { FiSearch, FiMapPin, FiClock, FiPhone, FiMail, FiPackage, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


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
     <main className="text-slate-100">
      {/* Hero with Search */}
      <section className="bg-slate-900 py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-white-100">
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


      {/* Stats Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <FiPackage className="mx-auto text-blue-600 text-3xl mb-2" />
            <h4 className="text-xl text-slate-600 font-bold">15,000+</h4>
            <p className="text-sm text-slate-600">Products Available</p>
          </div>
          <div>
            <FiUsers className="mx-auto text-green-600 text-3xl mb-2" />
            <h4 className="text-xl text-slate-600 font-bold">75,000+</h4>
            <p className="text-sm text-slate-600">Happy Customers</p>
          </div>
          <div>
            <FiAward className="mx-auto text-purple-600 text-3xl mb-2" />
            <h4 className="text-xl text-slate-600 font-bold">35+</h4>
            <p className="text-sm text-slate-600">Years Experience</p>
          </div>
          <div>
            <FiStar className="mx-auto text-orange-500 text-3xl mb-2" />
            <h4 className="text-xl text-slate-600 font-bold">4.9</h4>
            <p className="text-sm text-slate-600">Average Rating</p>
          </div>
        </div>
      </section>

       {/* Our Services */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg text-slate-600 font-semibold mb-2">Expert Advice</h4>
            <p className="text-sm text-slate-600">Get guidance on choosing the right tools for your project.</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg text-slate-600 font-semibold mb-2">Custom Orders</h4>
            <p className="text-sm text-slate-600">We help you source special tools or bulk orders with ease.</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-lg text-slate-600 font-semibold mb-2">Fast Delivery</h4>
            <p className="text-sm text-slate-600">Get your hardware essentials delivered quickly and safely.</p>
          </div>
        </div>
      </section>
      
      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl text-slate-600 font-semibold mb-8 text-center">Popular Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white text-slate-600  rounded-xl shadow-md hover:shadow-xl transition border border-slate-200 overflow-hidden"
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


      {/* Visit Section */}
      <section className="bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm bg-slate-400 text-black font-semibold px-3 py-1 rounded-full inline-block mb-4">
            📍 Visit Us Today
          </span>
          <h3 className="text-3xl font-bold mb-3">Come See Our Store</h3>
          <p className="text-md text-slate-200 max-w-2xl mx-auto mb-12">
            Experience our vibrant showroom filled with quality tools, friendly service, and expert advice for all your project needs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Location */}
            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600 text-xl mr-3">
                  <FiMapPin size={24} />
                </div>
                <h4 className="text-lg font-semibold">Our Location</h4>
              </div>
              <p className="mb-2">No 33/1, Hanwella Road, <br /> Kirindiwela</p>
              
            </div>

            {/* Store Hours */}
            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600 text-xl mr-3">
                  <FiClock size={24} />
                </div>
                <h4 className="text-lg font-semibold">Store Hours</h4>
              </div>
              <p className="mb-2">Mon–Sat: 7:00 AM – 8:00 PM<br />Sunday: 9:00 AM – 6:00 PM</p>
              <p className="text-yellow-500 mt-2 font-medium">✨ Extended holiday hours</p>
            </div>

            {/* Contact */}
            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600 text-xl mr-3">
                  <FiPhone size={24} />
                </div>
                <h4 className="text-lg  font-semibold">Contact Us</h4>
              </div>
              <p className="mb-2"> (555) 123-4567 / 0767795630 <br />
                <span className="inline-flex items-center gap-2 mt-1">
                  <FiMail size={16} className="text-slate-500" />
                  newcity.hardware.sl@gmail.com 
                </span>
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white-600 text-black py-14 text-center px-4">
        <h3 className="text-2xl font-bold">Need help finding the right tool?</h3>
        <p className="mt-2">Visit our store or contact us for expert advice.</p>
        <button className="mt-4 px-6 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-100 transition">
          Contact Us
        </button>
      </section>
    </main>
  );
}

export default Home;
