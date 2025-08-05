import { useState } from 'react';
import { FiSearch, FiMapPin, FiClock, FiPhone, FiMail, FiPackage, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import powerTools from '../../assets/power-tools.png';
import handTools from '../../assets/hand-tools.png';
import plumbing from '../../assets/plumbing.png';
import electrical from '../../assets/electrical.png';
import paints from '../../assets/paints.png';
import fasteners from '../../assets/fasteners.png';

function Home() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const categories = [
    { name: 'Power Tools', image: powerTools },
    { name: 'Hand Tools', image: handTools },
    { name: 'Plumbing', image: plumbing },
    { name: 'Electrical Tools', image: electrical },
    { name: 'Paint & Supplies', image: paints },
    { name: 'Fasteners', image: fasteners },
  ];

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([]);
      return;
    }

  const unsubscribe = onSnapshot(collectionGroup(db, 'items'), (snapshot) => {
    const allProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = allProducts
      .filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase())
      )
      .reduce((unique, item) => {
        const exists = unique.find((p) => p.name === item.name);
        if (!exists) unique.push(item);
        return unique;
      }, []);

    setSearchResults(filtered.slice(0, 6));
  });

    return () => unsubscribe();
  }, [search]);

  useEffect(() => {
    if (isInView && sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [isInView]);

  const scroll = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <main className="text-slate-100">

    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 0.6 }}
    >
 
      <section className="relative h-[100vh] bg-gradient-to-b from-[#8192f3] via-[#9dabdd] to-[#c5d7ff] overflow-hidden flex items-center justify-center">
       <motion.div
          className="relative z-10 text-center px-6 text-[#3F4A7A]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold drop-shadow-lg text-white">
            Welcome to New City Hardware
          </h1>
          <motion.p
            className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Trusted by builders for over 35 years. Quality tools, expert advice, and fast service all in one place.
          </motion.p>

          <motion.div
            className="mt-8 max-w-xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <FiSearch className="absolute top-3.5 left-4 text-[#7A88BA]" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F0F4FF] text-[#2A345B] border border-[#C9D2F4] placeholder:text-[#6C7BAD] focus:outline-none focus:ring-2 focus:ring-[#7F9FEA]"
            />

            {searchResults.length > 0 && (
              <div className="absolute z-20 bg-white text-black w-full mt-2 rounded-xl shadow-lg border border-gray-300 max-h-80 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${item.category}/${item.id}`)}
                  >
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {[
            {
              icon: <FiPackage className="mx-auto text-blue-600 text-3xl mb-2" />,
              title: '15,000+',
              subtitle: 'Products Available',
            },
            {
              icon: <FiUsers className="mx-auto text-green-600 text-3xl mb-2" />,
              title: '75,000+',
              subtitle: 'Happy Customers',
            },
            {
              icon: <FiAward className="mx-auto text-purple-600 text-3xl mb-2" />,
              title: '35+',
              subtitle: 'Years Experience',
            },
            {
              icon: <FiStar className="mx-auto text-orange-500 text-3xl mb-2" />,
              title: '4.9',
              subtitle: 'Average Rating',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="shadow-lg p-6 rounded-xl border border-slate-200"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              {item.icon}
              <h4 className="text-xl text-slate-700 font-bold">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-white py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {[
            {
              title: 'Expert Advice',
              text: 'Get guidance on choosing the right tools for your project.',
            },
            {
              title: 'Custom Orders',
              text: 'We help you source special tools or bulk orders with ease.',
            },
            {
              title: 'Fast Service',
              text: 'Get your hardware essentials quickly and affordably.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition hover:scale-[1.03]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-lg text-slate-700 font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section ref={sectionRef} className="bg-gradient-to-b from-[#c2c2f1] via-[#f8f7f7] to-[#ffffff] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-10">
            <motion.h3
              className="text-2xl sm:text-3xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Popular Categories
            </motion.h3>

            <div className="flex items-center gap-4">
              <button
                onClick={() => scroll(-300)}
                className="text-gray-600 hover:text-blue-500 transition text-xl"
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                onClick={() => scroll(300)}
                className="text-gray-600 hover:text-blue-500 transition text-xl"
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          <motion.div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                onClick={() => {
                  navigate(`/products?category=${encodeURIComponent(cat.name)}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-[240px] flex-shrink-0 cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="mt-3 px-1">
                  <h4 className="text-sm font-medium text-center text-gray-900">{cat.name}</h4>
                </div>
              </motion.div>
            ))}
            
          </motion.div>
          <div className="mt-16 text-center text-gray-800 font-bold text-4xl sm:text-4xl leading-snug">
            BUILT TO LAST<br />
            TRUSTED BY PROFESSIONALS ACROSS SRI LANKA.
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 text-white py-24 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-sm bg-white text-slate-900 font-semibold px-4 py-1 rounded-full inline-block mb-6 shadow">
            📍 Visit Us Today
          </span>
          <h3 className="text-3xl font-bold mb-4">Come See Our Store</h3>
          <p className="text-md text-slate-200 max-w-2xl mx-auto mb-16">
            Experience our vibrant showroom filled with quality tools, friendly service, and expert advice for all your project needs.
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.25 } },
            }}
          >
            {[
              {
                icon: <FiMapPin size={24} />,
                title: 'Our Location',
                content: (
                  <>
                    No 33/1, Hanwella Road,
                    <br />
                    Kirindiwela
                  </>
                ),
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: <FiClock size={24} />,
                title: 'Store Hours',
                content: (
                  <div>
                    <p>Mon–Sat: 7:00 AM – 8:00 PM</p>
                    <p>Sunday: 9:00 AM – 6:00 PM</p>
                    <p className="text-yellow-400 mt-1 font-medium">✨ Extended holiday hours</p>
                  </div>
                ),
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: <FiPhone size={24} />,
                title: 'Contact Us',
                content: (
                  <div>
                    <p>(555) 123-4567 / 0767795630</p>
                    <span className="inline-flex items-center gap-2 mt-1">
                      <FiMail size={16} className="text-slate-400" />
                      newcity.hardware.sl@gmail.com
                    </span>
                  </div>
                ),
                color: 'bg-purple-100 text-purple-600',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white text-slate-800 p-6 rounded-xl shadow-lg text-left"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`${item.color} p-3 rounded-xl text-xl mr-3`}>
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                </div>
                <div className="text-sm leading-relaxed space-y-1">{item.content}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white text-center py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            Need help finding the right tool?
          </h3>
          <p className="text-slate-600 text-md mb-6">
            Visit our store or contact us for expert advice tailored to your needs.
          </p>
          <button
            onClick={() => {
              navigate('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-2 inline-block px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl shadow hover:bg-slate-700 transition"
          >
            Contact Us
          </button>
        </motion.div>
      </section>
    </motion.div>
    </main>
  );
}

export default Home;
