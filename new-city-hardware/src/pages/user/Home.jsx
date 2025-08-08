import React, { useState, useEffect, useRef } from 'react';
import {
  FiMapPin, FiClock, FiPhone, FiMail, FiPackage, FiUsers, FiAward, FiStar,
  FiHelpCircle, FiShoppingCart, FiTruck
} from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
// import { db } from '../../firebase';
// import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { motion, useInView } from 'framer-motion';

function Home() {
  const navigate = useNavigate();
  // const [searchResults, setSearchResults] = useState([]);
  // const [search, setSearch] = useState('');
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const categories = [
    { 
      name: 'Power Tools', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fpower-tools.png?alt=media&token=73d52560-aadf-439c-afd3-c96eb382372a' ,
    },
    { 
      name: 'Hand Tools', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fhand-tools.png?alt=media&token=860d5512-9c3b-4a1e-ba9e-4173b7870f0e',
    },
    { 
      name: 'Plumbing', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fplumbing.png?alt=media&token=d891c280-8ff3-427a-88e0-62bb461cf2bd' ,
    },
    { 
      name: 'Electrical Tools', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Felectrical.png?alt=media&token=be84c180-93f9-423a-b73c-7caf7c817dd9' ,
    },
    { 
      name: 'Paint & Supplies', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fpaints.png?alt=media&token=40d59842-e84d-41ea-b8a2-2da017601606' ,
    },
    { 
      name: 'Fasteners', 
      image: 'https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Ffasteners.png?alt=media&token=84dcbc62-f455-43c1-84f4-5f506c8d8def' ,
    },
  ];

  // useEffect(() => {
  //   if (search.trim() === '') {
  //     setSearchResults([]);
  //     return;
  //   }

  //   const unsubscribe = onSnapshot(collectionGroup(db, 'items'), (snapshot) => {
  //     const allProducts = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     const filtered = allProducts
  //       .filter((product) =>
  //         product?.name?.toLowerCase().includes(search.toLowerCase())
  //       )
  //       .reduce((unique, item) => {
  //         const exists = unique.find((p) => p.name === item.name);
  //         if (!exists) unique.push(item);
  //         return unique;
  //       }, []);

  //     setSearchResults(filtered.slice(0, 6));
  //   });

  //   return () => unsubscribe();
  // }, [search]);

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
    <main className="text-[#0B1F3B]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.6 }}
      >
        {/* HERO — dark blue background */}
        <section className="relative h-[90vh] bg-[#0B1F3B] overflow-hidden px-6 sm:px-10">
          <div className="absolute top-[2%] w-full text-center z-10">
            <motion.h1
              className="text-[4.5rem] sm:text-[6.5rem] lg:text-[8.5rem] font-extrabold uppercase text-white tracking-tight leading-none"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              NEW CITY
            </motion.h1>
            <motion.span
              className="block text-2xl sm:text-3xl font-semibold text-white tracking-widest mt-2 ml-[0px] sm:ml-[430px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              HARDWARE
            </motion.span>
          </div>

          <motion.img
            src="https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fworker-hero1.png?alt=media&token=0c4ca0b5-d9a1-400c-a1d8-0fba77eb1ffc"
            alt="Working Man"
            loading="lazy"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[360px] sm:w-[420px] md:w-[600px] max-w-full z-0"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />

          <motion.p
            className="absolute bottom-5 sm:bottom-5 left-6 sm:left-10 text-white text-base sm:text-lg max-w-md sm:max-w-lg leading-relaxed sm:text-left text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Trusted by builders for over 35 years. <br />Quality tools, expert advice, and fast service all in one place.
          </motion.p>

          {/* HERO SEARCH — same position/logic, white input on dark bg */}
          <motion.div
            className="absolute bottom-85 sm:bottom-57 right-20 sm:right-123 w-[280px] sm:w-[450px] z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
          {/* <div className="relative">
  <FiSearch className="absolute top-3.5 left-4 text-black" size={20} />
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search products..."
    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-[#0B1F3B] placeholder:text-[#0B1F3B]/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
  />
  {searchResults.length > 0 && (
    <div className="absolute z-20 bg-white text-[#0B1F3B] w-full mt-2 rounded-xl shadow-lg border border-[#0B1F3B]/20 max-h-80 overflow-y-auto">
      {searchResults.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 px-4 py-3 hover:bg-[#0B1F3B]/5 cursor-pointer"
          onClick={() => navigate(`/product/${item.category}/${item.id}`)}
        >
          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  )}
</div> */}

          </motion.div>
        </section>

        {/* WHY CHOOSE — white background, dark blue accents */}
        <section className="bg-white py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white p-10 sm:p-14 shadow-sm rounded-none border border-[#0B1F3B]/15"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#0B1F3B]"
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
                    color: 'bg-[#0B1F3B]/10 text-[#0B1F3B]',
                  },
                  {
                    icon: <FiShoppingCart size={28} />,
                    title: 'Custom Orders',
                    text: 'We help you source special tools or bulk orders with ease.',
                    color: 'bg-[#0B1F3B]/10 text-[#0B1F3B]',
                  },
                  {
                    icon: <FiTruck size={28} />,
                    title: 'Fast Service',
                    text: 'Get your hardware essentials quickly and affordably.',
                    color: 'bg-[#0B1F3B]/10 text-[#0B1F3B]',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white text-[#0B1F3B] p-6 rounded-xl border border-[#0B1F3B]/15 hover:border-[#0B1F3B]/30 shadow-xs hover:shadow-sm transition"
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
                    <p className="text-sm leading-relaxed text-[#0B1F3B]/80">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* POPULAR CATEGORIES — white bg, blue text */}
        <section ref={sectionRef} className="bg-white py-20 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <motion.h3
                className="text-2xl sm:text-3xl font-semibold text-[#0B1F3B]"
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
                  className="text-[#0B1F3B]/80 hover:text-[#0B1F3B] transition text-xl"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  onClick={() => scroll(300)}
                  className="text-[#0B1F3B]/80 hover:text-[#0B1F3B] transition text-xl"
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
                  <div className="w-full aspect-[3/4] bg-white overflow-hidden rounded-xl border border-[#0B1F3B]/15">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 px-1">
                    <h4 className="text-sm font-medium text-center text-[#0B1F3B]">{cat.name}</h4>
                  </div>
                </motion.div>
              ))}
              
            </motion.div>
            <div className="mt-16 text-center text-[#0B1F3B] font-bold text-4xl sm:text-4xl leading-snug">
              BUILT TO LAST<br />
              TRUSTED BY PROFESSIONALS ACROSS SRI LANKA.
            </div>
          </div>
        </section>

        {/* STATS — dark blue section with white cards */}
        <section className="bg-[#0B1F3B] py-20 px-4">
          <div className="max-100-6xl mx-auto">
            <motion.div
              className="p-10 sm:p-14 rounded-none"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
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
                    icon: <FiPackage className="mx-auto text-4xl mb-3" />,
                    title: '15,000+',
                    subtitle: 'Products Available',
                  },
                  {
                    icon: <FiUsers className="mx-auto text-4xl mb-3" />,
                    title: '75,000+',
                    subtitle: 'Happy Customers',
                  },
                  {
                    icon: <FiAward className="mx-auto text-4xl mb-3" />,
                    title: '35+',
                    subtitle: 'Years Experience',
                  },
                  {
                    icon: <FiStar className="mx-auto text-4xl mb-3" />,
                    title: '4.9',
                    subtitle: 'Average Rating',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md text-[#0B1F3B]"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-sm opacity-80">{item.subtitle}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* VISIT US — dark blue card on white bg */}
        <section className="bg-white py-24 px-4 mt-16">
          <div className="max-100-5xl mx-auto">
            <motion.div
              className="bg-[#0B1F3B] text-white p-10 sm:p-14 shadow-xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="text-sm bg-white text-[#0B1F3B] font-semibold px-4 py-1 rounded-full inline-block mb-6 shadow"
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
                className="text-md text-white/90 max-w-2xl  mb-16"
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
                  },
                  {
                    icon: <FiClock size={24} />,
                    title: 'Store Hours',
                    content: (
                      <div>
                        <p>Mon–Sat: 7:00 AM – 8:00 PM</p>
                        <p>Sunday: 9:00 AM – 6:00 PM</p>
                        <p className="mt-1 font-medium">✨ Extended holiday hours</p>
                      </div>
                    ),
                  },
                  {
                    icon: <FiPhone size={24} />,
                    title: 'Contact Us',
                    content: (
                      <div>
                        <p>(555) 123-4567 / 0767795630</p>
                        <span className="inline-flex items-center gap-2 mt-1">
                          <FiMail size={16} className="opacity-80" />
                          newcity.hardware.sl@gmail.com
                        </span>
                      </div>
                    ),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white text-[#0B1F3B] p-6 rounded-xl shadow-xl text-left"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-[#0B1F3B]/10 text-[#0B1F3B] p-3 rounded-xl text-xl mr-3">
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

        {/* SERVICE CTA — white bg with blue accents */}
        <section className="bg-white py-20 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-center text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              THE HARDWARE YOU NEED, DELIVERED RIGHT
            </motion.h2>
            <motion.div
              className="bg-white p-6 sm:p-10 rounded-none border border-[#0B1F3B]/15"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="bg-white p-10 sm:p-14 shadow-md w-full h-full border border-[#0B1F3B]/15">
                  <p className="text-sm font-semibold text-[#0B1F3B]/70 mb-2 uppercase tracking-wide">
                    OUR EXCLUSIVE SERVICE
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-4">
                    Expert Guidance
                  </h3>
                  <p className="text-[#0B1F3B]/80 text-md mb-6 leading-relaxed">
                    Need help finding the right tool or material? Our in-store experts are here to guide you.
                    Contact us now for personalized assistance with your construction or repair needs.
                  </p>
                  <button
                    onClick={() => {
                      navigate('/contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-block px-6 py-3 bg-[#0B1F3B] text-white font-semibold hover:opacity-90 transition"
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
                    src="https://firebasestorage.googleapis.com/v0/b/newcityhardware-5b084.firebasestorage.app/o/home_page%2Fhelp_img.jpg?alt=media&token=c3f5a07c-c97f-402a-a05b-38f4d2aab133"
                    alt="Expert Assistance"
                    loading="lazy"
                    className="w-full h-full object-cover border border-[#0B1F3B]/15"
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
