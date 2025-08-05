import { useState } from 'react';
import { FiSearch, FiMapPin, FiClock, FiPhone, FiMail, FiPackage, FiUsers, FiAward, FiStar, FiHelpCircle, FiShoppingCart, FiTruck } from 'react-icons/fi';
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
import help from '../../assets/help_img.jpg';
import heroImage from '../../assets/worker-hero.png';

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
 
      <section className="relative h-[90vh] bg-gradient-to-b from-[#BFC7F3] via-[#C9D2F4] to-[#7F9FEA] overflow-hidden px-6 sm:px-10">
        <div className="absolute top-[8%] w-full text-center z-10">
          <motion.h1
            className="text-[4.5rem] sm:text-[6.5rem] lg:text-[8.5rem] font-extrabold uppercase text-white tracking-tight leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            NEW CITY
          </motion.h1>
          <motion.span
            className="block text-2xl sm:text-3xl font-semibold text-white tracking-widest mt-2 ml-[80px] sm:ml-[430px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            HARDWARE
          </motion.span>
        </div>

        <motion.img
          src={heroImage}
          alt="Working Man"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[320px] sm:w-[420px] md:w-[500px] z-0"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <motion.p
          className="absolute bottom-44 left-6 text-white text-base sm:text-lg max-w-md sm:max-w-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Trusted by builders for over 35 years. Quality tools, expert advice, and fast service all in one place.
        </motion.p>

        <motion.div
          className="absolute bottom-65 right-6 sm:right-10 w-[280px] sm:w-[450px] z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="relative">
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
          </div>
        </motion.div>
      </section>

      <section className="bg-[#F8FAFF] py-20 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-gradient-to-tr from-[#BFC7F3] via-[#C9D2F4] to-[#7F9FEA] text-white p-10 sm:p-14 shadow-xl rounded-none"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-center mb-12 text-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              viewport={{ once: true }}
            >
              WHY CHOOSE NEW CITY HARDWARE?
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.3 } },
              }}
            >
              {[
                {
                  icon: <FiHelpCircle size={28} />,
                  title: 'Expert Advice',
                  text: 'Get guidance on choosing the right tools for your project.',
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  icon: <FiShoppingCart size={28} />,
                  title: 'Custom Orders',
                  text: 'We help you source special tools or bulk orders with ease.',
                  color: 'bg-green-100 text-green-600',
                },
                {
                  icon: <FiTruck size={28} />,
                  title: 'Fast Service',
                  text: 'Get your hardware essentials quickly and affordably.',
                  color: 'bg-yellow-100 text-yellow-600',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition hover:scale-[1.03]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl text-xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={sectionRef} className="bg-gradient-to-b from-[#c8ddf4] via-[#f0f7fb] to-[#ffffff] py-20 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
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

      <section className="bg-[#e7ebed] py-20 px-4">
        <div className="max-100-6xl mx-auto">
          <motion.div
            className="bg-gradient-to-b from-[#b8c8d8] via-[#b8b8e0] to-[#97a3cd] p-10 sm:p-14 rounded-none shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-black text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              TRUSTED BY THOUSANDS NATIONWIDE
            </motion.h2>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.3 } },
              }}
            >
              {[
                {
                  icon: <FiPackage className="mx-auto text-blue-700 text-4xl mb-3" />,
                  title: '15,000+',
                  subtitle: 'Products Available',
                },
                {
                  icon: <FiUsers className="mx-auto text-green-600 text-4xl mb-3" />,
                  title: '75,000+',
                  subtitle: 'Happy Customers',
                },
                {
                  icon: <FiAward className="mx-auto text-purple-600 text-4xl mb-3" />,
                  title: '35+',
                  subtitle: 'Years Experience',
                },
                {
                  icon: <FiStar className="mx-auto text-yellow-400 text-4xl mb-3" />,
                  title: '4.9',
                  subtitle: 'Average Rating',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                  <h4 className="text-xl font-bold text-slate-800">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#ecf0f9] py-24 px-4 mt-16">
        <div className="max-100-5xl mx-auto">
          <motion.div
            className="bg-gradient-to-tr from-[#85a1e4] to-[#7dbdee] text-white p-10 sm:p-14 shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-sm bg-white text-slate-900 font-semibold px-4 py-1 rounded-full inline-block mb-6 shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              📍 Visit Us Today
            </motion.span>

            <motion.h3
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
            >
              Come See Our Store
            </motion.h3>

            <motion.p
              className="text-md text-slate-100 max-w-2xl  mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Experience our vibrant showroom filled with quality tools, friendly service, and expert advice for all your project needs.
            </motion.p>

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
                  className="bg-white text-slate-800 p-6 rounded-xl shadow-xl text-left"
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
        </div>
      </section>

      <section className="bg-[#F8FAFF] py-20 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center text-3xl sm:text-4xl font-bold text-black mb-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            THE HARDWARE YOU NEED, DELIVERED RIGHT
          </motion.h2>
          <motion.div
            className="bg-gradient-to-tr from-[#BFC7F3] via-[#C9D2F4] to-[#7F9FEA] p-6 sm:p-10 rounded-none"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="bg-white p-10 sm:p-14 shadow-md w-full h-full">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  OUR EXCLUSIVE SERVICE
                </p>
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                  Expert Guidance
                </h3>
                <p className="text-slate-600 text-md mb-6 leading-relaxed">
                  Need help finding the right tool or material? Our in-store experts are here to guide you.
                  Contact us now for personalized assistance with your construction or repair needs.
                </p>
                <button
                  onClick={() => {
                    navigate('/contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-block px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition"
                >
                  Contact Us
                </button>
              </div>

              <motion.div
                className="w-full h-full flex items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <img
                  src={help}
                  alt="Expert Assistance"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
    </main>
  );
}

export default Home;
