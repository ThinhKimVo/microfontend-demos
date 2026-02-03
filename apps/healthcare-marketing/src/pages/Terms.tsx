import { Link } from 'react-router-dom';
import { FileDown, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

// Table of Contents
const tableOfContents = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'account', title: '3. Account Registration' },
  { id: 'services', title: '4. Our Services' },
  { id: 'payments', title: '5. Payments and Billing' },
  { id: 'user-conduct', title: '6. User Conduct' },
  { id: 'therapist-terms', title: '7. Therapist Terms' },
  { id: 'intellectual-property', title: '8. Intellectual Property' },
  { id: 'disclaimers', title: '9. Disclaimers' },
  { id: 'limitation', title: '10. Limitation of Liability' },
  { id: 'termination', title: '11. Termination' },
  { id: 'governing-law', title: '12. Governing Law' },
  { id: 'contact', title: '13. Contact Information' },
];

export default function Terms() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
              Terms of <span className="gradient-text">Service</span>
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
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-secondary-900">1. Acceptance of Terms</h2>
                <p className="text-secondary-600 mt-4">
                  By accessing or using the Hopefull platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                </p>
                <p className="text-secondary-600 mt-4">
                  We reserve the right to modify these Terms at any time. Your continued use of the Service after any changes indicates your acceptance of the modified Terms.
                </p>
              </section>

              <section id="eligibility" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">2. Eligibility</h2>
                <p className="text-secondary-600 mt-4">
                  To use our Service, you must:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Not be prohibited from using the Service under applicable laws</li>
                  <li>Provide accurate and complete registration information</li>
                </ul>
              </section>

              <section id="account" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">3. Account Registration</h2>
                <p className="text-secondary-600 mt-4">
                  To access certain features of our Service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your contact information remains accurate and up-to-date</li>
                </ul>
              </section>

              <section id="services" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">4. Our Services</h2>
                <p className="text-secondary-600 mt-4">
                  Hopefull provides a platform connecting users with licensed mental health therapists. Our services include:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Video and text-based therapy sessions</li>
                  <li>Therapist matching and booking</li>
                  <li>Secure messaging between sessions</li>
                  <li>Progress tracking and session notes</li>
                </ul>
                <p className="text-secondary-600 mt-4">
                  <strong>Important:</strong> Our Service is not intended for emergency situations. If you are experiencing a mental health emergency, please call 911 or your local emergency services immediately.
                </p>
              </section>

              <section id="payments" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">5. Payments and Billing</h2>
                <p className="text-secondary-600 mt-4">
                  By using our paid services, you agree to the following:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>All payments are processed through secure third-party payment processors</li>
                  <li>Prices are displayed before booking and may vary by therapist</li>
                  <li>Cancellations made less than 24 hours before a session may incur charges</li>
                  <li>Refunds are handled on a case-by-case basis</li>
                  <li>We may change prices with reasonable notice</li>
                </ul>
              </section>

              <section id="user-conduct" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">6. User Conduct</h2>
                <p className="text-secondary-600 mt-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Harass, abuse, or harm other users or therapists</li>
                  <li>Share your account credentials with others</li>
                  <li>Attempt to access other users' accounts or data</li>
                  <li>Record sessions without consent</li>
                  <li>Use automated systems to access the Service</li>
                  <li>Interfere with the proper functioning of the Service</li>
                </ul>
              </section>

              <section id="therapist-terms" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">7. Therapist Terms</h2>
                <p className="text-secondary-600 mt-4">
                  Therapists using our platform must:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Maintain valid, unrestricted professional licenses</li>
                  <li>Comply with all applicable professional and ethical standards</li>
                  <li>Maintain professional liability insurance</li>
                  <li>Protect client confidentiality in accordance with HIPAA and applicable laws</li>
                  <li>Not provide services outside of their competency</li>
                </ul>
                <p className="text-secondary-600 mt-4">
                  Therapists are independent contractors, not employees of Hopefull.
                </p>
              </section>

              <section id="intellectual-property" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">8. Intellectual Property</h2>
                <p className="text-secondary-600 mt-4">
                  All content, features, and functionality of the Service are owned by Hopefull and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section id="disclaimers" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">9. Disclaimers</h2>
                <p className="text-secondary-600 mt-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                </p>
                <p className="text-secondary-600 mt-4">
                  Hopefull is a platform that connects users with therapists. We do not provide medical advice, diagnoses, or treatment. The therapists on our platform are independent professionals responsible for their own clinical decisions.
                </p>
              </section>

              <section id="limitation" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">10. Limitation of Liability</h2>
                <p className="text-secondary-600 mt-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOPEFULL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                </p>
                <p className="text-secondary-600 mt-4">
                  Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section id="termination" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">11. Termination</h2>
                <p className="text-secondary-600 mt-4">
                  We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service will immediately cease.
                </p>
                <p className="text-secondary-600 mt-4">
                  You may terminate your account at any time by contacting us. Certain provisions of these Terms will survive termination.
                </p>
              </section>

              <section id="governing-law" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">12. Governing Law</h2>
                <p className="text-secondary-600 mt-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of San Francisco County, California.
                </p>
              </section>

              <section id="contact" className="scroll-mt-24 mt-12">
                <h2 className="text-2xl font-bold text-secondary-900">13. Contact Information</h2>
                <p className="text-secondary-600 mt-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <ul className="list-disc list-inside text-secondary-600 mt-4 space-y-2">
                  <li>Email: legal@hopefull.app</li>
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
