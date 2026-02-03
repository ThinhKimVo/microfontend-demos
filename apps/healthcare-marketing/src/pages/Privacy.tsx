import { Link } from 'react-router-dom';
import { FileDown, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

// Table of Contents
const tableOfContents = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'data-sharing', title: '4. Data Sharing and Disclosure' },
  { id: 'data-security', title: '5. Data Security' },
  { id: 'your-rights', title: '6. Your Rights' },
  { id: 'cookies', title: '7. Cookies and Tracking' },
  { id: 'children', title: '8. Children\'s Privacy' },
  { id: 'changes', title: '9. Changes to This Policy' },
  { id: 'contact', title: '10. Contact Us' },
];

export default function Privacy() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <div className="mt-6 flex items-center justify-center gap-2 text-secondary-600">
              <Calendar className="w-5 h-5" />
              <span>Last updated: January 15, 2025</span>
            </div>
            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <FileDown className="w-5 h-5" />
                Download PDF Version
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Table of Contents</h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 prose prose-lg max-w-none">
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-secondary-900">1. Introduction</h2>
                <p className="text-secondary-600 mt-4">
                  Hopefull ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
                </p>
                <p className="text-secondary-600 mt-4">
                  Please read this privacy policy carefully. By using the Service, you consent to the practices described in this policy.
                </p>
              </section>

              <section id="information-we-collect" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-secondary-800 mt-6">Personal Information</h3>
                <p className="text-secondary-600 mt-4">
                  We may collect personal information that you voluntarily provide when using our Service, including:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth and gender</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Health-related information you choose to share during therapy sessions</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-secondary-800 mt-6">Automatically Collected Information</h3>
                <p className="text-secondary-600 mt-4">
                  When you access our Service, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Device information (type, operating system, unique identifiers)</li>
                  <li>Log data (access times, pages viewed, IP address)</li>
                  <li>Location information (with your consent)</li>
                  <li>Usage patterns and preferences</li>
                </ul>
              </section>

              <section id="how-we-use" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">3. How We Use Your Information</h2>
                <p className="text-secondary-600 mt-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Provide, operate, and maintain our Service</li>
                  <li>Connect you with licensed therapists</li>
                  <li>Process payments and send transaction notifications</li>
                  <li>Improve and personalize your experience</li>
                  <li>Communicate with you about updates, promotions, and support</li>
                  <li>Ensure compliance with legal obligations</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </section>

              <section id="data-sharing" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">4. Data Sharing and Disclosure</h2>
                <p className="text-secondary-600 mt-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li><strong>With Therapists:</strong> Information necessary to provide therapy services</li>
                  <li><strong>Service Providers:</strong> Third parties who help us operate our Service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                </ul>
              </section>

              <section id="data-security" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">5. Data Security</h2>
                <p className="text-secondary-600 mt-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>End-to-end encryption for all communications</li>
                  <li>HIPAA-compliant data storage and handling</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Strict access controls and employee training</li>
                  <li>Secure data centers with physical security measures</li>
                </ul>
              </section>

              <section id="your-rights" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">6. Your Rights</h2>
                <p className="text-secondary-600 mt-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-secondary-600 mt-4">
                  To exercise these rights, contact us at privacy@hopefull.app.
                </p>
              </section>

              <section id="cookies" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">7. Cookies and Tracking</h2>
                <p className="text-secondary-600 mt-4">
                  We use cookies and similar tracking technologies to enhance your experience. Types of cookies we use:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="text-secondary-600 mt-4">
                  You can manage cookie preferences through your browser settings.
                </p>
              </section>

              <section id="children" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">8. Children's Privacy</h2>
                <p className="text-secondary-600 mt-4">
                  Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section id="changes" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">9. Changes to This Policy</h2>
                <p className="text-secondary-600 mt-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically.
                </p>
              </section>

              <section id="contact" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">10. Contact Us</h2>
                <p className="text-secondary-600 mt-4">
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Email: privacy@hopefull.app</li>
                  <li>Phone: 1-800-HOPEFUL</li>
                  <li>Address: 123 Wellness St, San Francisco, CA 94102</li>
                </ul>
                <div className="mt-6">
                  <Link to="/contact" className="btn-primary">
                    Contact Us
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
