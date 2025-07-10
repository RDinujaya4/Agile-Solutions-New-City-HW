import { FiTool, FiUsers, FiMapPin, FiAward } from 'react-icons/fi';


import AboutUs from '../assets/AboutUs.png';

function About() {
  return (
    <main className="text-slate-800">
      {/* Hero Section */}
      <section className="relative bg-slate-100 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900">About New City Hardware</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Learn more about who we are, our history, and our commitment to excellence.
        </p>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-slate-700 leading-relaxed">
              Founded over 35 years ago, New City Hardware has been a trusted source for builders,
              homeowners, and professionals alike. With a strong belief in service, reliability, and
              product quality, we've grown from a small local shop into a full-service hardware and
              tool destination.
            </p>
            <p className="text-slate-700 mt-4 leading-relaxed">
              Our success is built on customer relationships and a passion for helping our community
              build, repair, and improve with confidence.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
              <img
                src={AboutUs}
                alt="New City Hardware Logo"
                className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Milestones Timeline Section */}
<section className="bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 text-white py-20 px-4">
  <div className="max-w-6xl mx-auto text-center">
   
    <h3 className="text-3xl font-bold mb-2">
      Milestones of <span className="text-blue-400">Innovation</span>
    </h3>
  </div>

  <div className="mt-12 max-w-5xl mx-auto relative border-l-4 border-blue-500 pl-8">
    {/* Timeline Item 1 */}
    <div className="mb-10 relative">
      <div className="absolute -left-4 top-1 w-8 h-8 bg-blue-500 rounded-full border-4 border-white"></div>
      <div className="bg-slate-700 p-6 rounded-xl shadow-md">
        <span className="text-sm text-blue-300 font-semibold">1985</span>
        <h4 className="text-lg font-bold mt-1 mb-2">Humble Beginnings</h4>
        <p className="text-slate-300 text-sm">
          Started as a small family hardware store with just 500 products.
        </p>
      </div>
    </div>

    {/* Timeline Item 2 */}
    <div className="mb-10 relative">
      <div className="absolute -left-4 top-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
      <div className="bg-slate-700 p-6 rounded-xl shadow-md">
        <span className="text-sm text-green-300 font-semibold">1995</span>
        <h4 className="text-lg font-bold mt-1 mb-2">Community Growth</h4>
        <p className="text-slate-300 text-sm">
          Expanded to serve 10,000+ customers with professional-grade tools.
        </p>
      </div>
    </div>

    {/* Timeline Item 3 */}
    <div className="mb-10 relative">
      <div className="absolute -left-4 top-1 w-8 h-8 bg-lime-500 rounded-full border-4 border-white"></div>
      <div className="bg-slate-700 p-6 rounded-xl shadow-md">
        <span className="text-sm text-lime-300 font-semibold">2015</span>
        <h4 className="text-lg font-bold mt-1 mb-2">Sustainability Focus</h4>
        <p className="text-slate-300 text-sm">
          Pioneered eco-friendly tools and sustainable business practices.
        </p>
      </div>
    </div>

    {/* Timeline Item 4 */}
    <div className="relative">
      <div className="absolute -left-4 top-1 w-8 h-8 bg-orange-500 rounded-full border-4 border-white"></div>
      <div className="bg-slate-700 p-6 rounded-xl shadow-md">
        <span className="text-sm text-orange-300 font-semibold">2025</span>
        <h4 className="text-lg font-bold mt-1 mb-2">Digital Innovation</h4>
        <p className="text-slate-300 text-sm">
          Launched online platform and introduced smart inventory systems.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Why Choose Us */}
      <section className="bg-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-white rounded-xl shadow border border-slate-200">
              <FiTool className="text-blue-600 text-3xl mb-4" />
              <h4 className="font-semibold text-lg">Wide Range of Products</h4>
              <p className="text-sm text-slate-600 mt-2">
                We stock everything from power tools to building materials and more.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow border border-slate-200">
              <FiUsers className="text-green-600 text-3xl mb-4" />
              <h4 className="font-semibold text-lg">Dedicated Team</h4>
              <p className="text-sm text-slate-600 mt-2">
                Our staff is experienced, knowledgeable, and here to help.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow border border-slate-200">
              <FiMapPin className="text-purple-600 text-3xl mb-4" />
              <h4 className="font-semibold text-lg">Community Focused</h4>
              <p className="text-sm text-slate-600 mt-2">
                We support local projects and are proud to serve Kirindiwela and surrounding areas.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow border border-slate-200">
              <FiAward className="text-yellow-500 text-3xl mb-4" />
              <h4 className="font-semibold text-lg">Trusted Reputation</h4>
              <p className="text-sm text-slate-600 mt-2">
                With over 75,000 happy customers and 35+ years of experience, you can count on us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-600 text-white py-16 text-center px-4">
        <h2 className="text-2xl font-bold">We’re Here to Help You Build Better</h2>
        <p className="mt-2">Visit our store or get in touch to learn more about how we can support your next project.</p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-700 font-medium rounded-xl hover:bg-slate-100 transition">
          Contact Us
        </button>
      </section>
    </main>
  );
}

export default About;
