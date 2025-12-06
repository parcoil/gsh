import { useHead } from "@unhead/react";

function Privacy() {
  useHead({
    title: "Privacy Policy - Game Site Hub",
    meta: [
      {
        name: "description",
        content: "Read the Privacy Policy for Game Site Hub. Learn how we collect, use, and protect your personal information."
      }
    ]
  });
  return (
   <div className="max-w-4xl mx-auto px-6 py-12">
  <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
  <p className="mb-6"><strong>Effective Date:</strong> October 17, 2025</p>
  <p className="mb-6">
    This Privacy Policy describes how <strong>Game Site Hub by Parcoil</strong> (the "Site", "we", "our", or "us") collects, uses, and protects your information when you use our website and services.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
  <h3 className="text-xl font-medium mt-6 mb-2">Personal Information</h3>
  <ul className="list-disc list-inside mb-4">
    <li><strong>Email Address:</strong> Collected when you log in via Google account for authentication purposes.</li>
    <li><strong>IP Address:</strong> Collected when you vote on sites to prevent vote manipulation and ensure fair voting.</li>
  </ul>

  <h3 className="text-xl font-medium mt-6 mb-2">Non-Personal Information</h3>
  <ul className="list-disc list-inside mb-4">
    <li>Browser type and version</li>
    <li>Operating system</li>
    <li>Pages visited and time spent on the Site</li>
    <li>Referral sources</li>
  </ul>

  <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
  <ul className="list-disc list-inside mb-4">
    <li>To provide and maintain our services</li>
    <li>To authenticate users and secure accounts</li>
    <li>To prevent vote manipulation and ensure fair voting</li>
    <li>To improve our services and user experience</li>
    <li>To communicate with you about your account or our services</li>
  </ul>

  <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing and Disclosure</h2>
  <p className="mb-4">
    We do not sell, trade, or rent your personal information to third parties for marketing purposes. We may share your information only in the following circumstances:
  </p>
  <ul className="list-disc list-inside mb-4">
    <li>With your explicit consent</li>
    <li>To comply with legal obligations</li>
    <li>To protect our rights, property, or safety, or that of our users</li>
    <li>In connection with a business transfer or merger</li>
  </ul>

  <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
  <p className="mb-4">
    We use cookies and similar technologies to enhance your experience on our Site. Cookies help us remember your preferences and understand how you use our services.
  </p>
  <ul className="list-disc list-inside mb-4">
    <li><strong>Essential Cookies:</strong> Required for the Site to function properly</li>
    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Site</li>
    <li><strong>Authentication Cookies:</strong> Used to keep you logged in</li>
  </ul>
  <p className="mb-4">
    You can control cookie settings through your browser preferences.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
  <p className="mb-4">
    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
  <p className="mb-4">
    We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
  <p className="mb-4">
    Depending on your location, you may have the following rights regarding your personal information:
  </p>
  <ul className="list-disc list-inside mb-4">
    <li>Access to your personal information</li>
    <li>Correction of inaccurate information</li>
    <li>Deletion of your personal information</li>
    <li>Restriction or objection to processing</li>
    <li>Data portability</li>
  </ul>
  <p className="mb-4">
    To exercise these rights, please contact us using the information provided below.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
  <p className="mb-4">
    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
  <p className="mb-4">
    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
  </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
  <p>
    If you have any questions about this Privacy Policy or our data practices, please contact us at <strong>info@parcoil.com</strong>.
  </p>
</div>
  )
}

export default Privacy