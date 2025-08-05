import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useState } from "react";
import { toast } from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";
import { Toast } from '../../utils/toast';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    if (!recaptchaToken) {
      Toast.fire({
        icon: 'warning',
        title: "Please verify you're not a robot.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });

      if (response.status === 429) {
        Toast.fire({
          icon: 'error',
          title: "You already sent a message. Try again later.",
        });
      } else if (response.ok) {
        setSuccess("Message sent successfully!");
        Toast.fire({
          icon: 'success',
          title: "Your message has been sent!",
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'question',
        title: 'Something went wrong.',
      });
    }

  setLoading(false);
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#8694ec] via-[#93a4e1] to-[#edf2fe] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-slate-200 mt-2">We’d love to hear from you. Reach out with questions or feedback.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

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

          <div className="md:col-span-2 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter Name"
                  className="w-full bg-white/20 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your Email"
                  className="w-full bg-white/20 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your message..."
                  className="w-full bg-white/20 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none"
                  required
                />
              </div>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
                className="mt-4"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && (
                <p className="text-sm text-center mt-2">{success}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
