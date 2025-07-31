import { Link } from 'react-router-dom';
import { FiHome, FiBox, FiInfo, FiMail, FiFacebook, FiInstagram, FiArrowUp } from 'react-icons/fi';


function Footer() {
  return (
    <footer className="bg-slate-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

        {/* Contact Info */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Contact Us</h3>
          <p>No 33/1, Hanwella Road, Kirindiwela</p>
          <p>Tel: 0332246057 / 0767795630</p>
          <p>
            Email:{' '}
            <a href="mailto:newcity.hardware.sl@gmail.com" className="hover:text-blue-400 break-all">
              newcity.hardware.sl@gmail.com
            </a>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col lg:items-center">
          <h3 className="text-base font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/" className="flex items-center gap-1 hover:text-blue-400"><FiHome /> Home</a>
            <a href="/products" className="flex items-center gap-1 hover:text-blue-400"><FiBox /> Products</a>
            <a href="/about" className="flex items-center gap-1 hover:text-blue-400"><FiInfo /> About</a>
            <a href="/contact" className="flex items-center gap-1 hover:text-blue-400"><FiMail /> Contact</a>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col lg:items-end">
          <h3 className="text-base font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mb-3">
            <a href="https://facebook.com" className="flex items-center gap-1 hover:text-blue-400"><FiFacebook /> Facebook</a>
            <a href="https://www.instagram.com/" className="flex items-center gap-1 hover:text-blue-400"><FiInstagram /> Instagram</a>
            <a href="mailto:newcity.hardware.sl@gmail.com" className="flex items-center gap-1 hover:text-blue-400"><FiMail /> Email</a>
          </div>
          <p className="text-xs text-slate-400">&copy; 2025 New City Hardware. All rights reserved.</p>
        </div>

      </div>

      {/* Scroll to top button */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </button>
      </div>

    </footer>
  );
}

export default Footer;
