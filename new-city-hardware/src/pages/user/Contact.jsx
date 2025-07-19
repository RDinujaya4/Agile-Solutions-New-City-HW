import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-slate-200 mt-2">We’d love to hear from you. Reach out with questions or feedback.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Our Store</h2>
              <p className="flex items-start gap-2 text-sm text-slate-200">
                <FiMapPin className="mt-1" />
                No 33/1, Hanwella Road, Kirindiwela
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="flex items-center gap-2 text-sm text-slate-200">
                <FiMail /> newcity.hardware.sl@gmail.com 
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p className="flex items-center gap-2 text-sm text-slate-200">
                <FiPhone /> 0332246057/0767795630 
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="w-full bg-white/20 text-white placeholder-slate-300 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full bg-white/20 text-white placeholder-slate-300 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows="5"
                  placeholder="Your message..."
                  className="w-full bg-white/20 text-white placeholder-slate-300 px-4 py-3 rounded-xl focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
