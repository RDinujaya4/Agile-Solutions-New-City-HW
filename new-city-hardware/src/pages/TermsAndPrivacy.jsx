import React from 'react';

export default function TermsAndPrivacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Terms of Service & Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to New City Hardware. By accessing or using our website, you agree to be bound by these Terms of Service and Privacy Policy. Please read them carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. Account Registration</h2>
        <p>
          When creating an account, you must provide accurate and complete information. You are responsible for safeguarding your account credentials.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. Use of Our Service</h2>
        <p>
          You agree to use our services only for lawful purposes. Any misuse or unauthorized access to our systems is strictly prohibited.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. Privacy</h2>
        <p>
          We collect personal data such as your name, email, and order details. This information is used solely for order processing, account management, and customer support. We do not share your data with third parties without consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. Data Security</h2>
        <p>
          We implement strong security measures to protect your data. However, we cannot guarantee absolute security against all threats.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Modifications</h2>
        <p>
          We reserve the right to update or modify these terms at any time. Continued use of our service implies acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p>
          If you have questions about these terms, please contact us at <a href="mailto:newcity.hardware.sl@gmail.com" className="text-blue-600 underline">newcity.hardware.sl@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
