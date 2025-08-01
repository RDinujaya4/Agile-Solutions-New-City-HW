import React from 'react';

export default function TermsAndPrivacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service & Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the New City Hardware website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use this website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
        <p>
          You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Providing false information may result in account termination.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Use of Website</h2>
        <p>
          You agree not to use this website for any unlawful or prohibited purposes. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Product Availability & Pricing</h2>
        <p>
          Product availability, prices, and promotions are subject to change without prior notice. We reserve the right to cancel or modify orders due to pricing or inventory errors.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Privacy Policy</h2>
        <p>
          We are committed to protecting your personal data. We collect information such as your name, contact details, and purchase history for order fulfillment and service improvement. We do not sell or share your personal data with third parties except as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Security</h2>
        <p>
          We implement industry-standard security practices to safeguard your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
        <p>
          New City Hardware shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use this website or services, including but not limited to loss of profits, data, or goodwill.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Updated terms will be posted on this page and become effective immediately upon publication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes shall be resolved in the courts of Sri Lanka.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">10. Contact Information</h2>
        <p>
          If you have any questions about these Terms or our Privacy Policy, please contact us at:
          <br />
          <span className="font-medium">Email:</span>{' '}
          <a href="mailto:newcity.hardware.sl@gmail.com" className="text-blue-600 underline">
            newcity.hardware.sl@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
