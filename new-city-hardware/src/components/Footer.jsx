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

        {/* Quick Links (Horizontal) */}
        <div className="flex flex-col lg:items-center">
          <h3 className="text-base font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-blue-400">Home</a>
            <a href="#" className="hover:text-blue-400">Products</a>
            <a href="#" className="hover:text-blue-400">About</a>
            <a href="#" className="hover:text-blue-400">Contact</a>
          </div>
        </div>

        {/* Socials & Rights */}
        <div className="flex flex-col lg:items-end">
          <h3 className="text-base font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mb-3">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
            <a href="#" className="hover:text-blue-400">LinkedIn</a>
          </div>
          <p className="text-xs text-slate-400">&copy; 2025 New City Hardware. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
