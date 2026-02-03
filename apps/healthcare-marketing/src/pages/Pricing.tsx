import { Link } from 'react-router-dom';
import {
  Clock,
  Video,
  Phone,
  CheckCircle,
  CreditCard,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import Card from '@/components/ui/Card';

// Hero Section
function PricingHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-secondary-600">
            Pay only for the sessions you book. No subscriptions, no hidden fees. Quality therapy that fits your budget.
          </p>
        </div>
      </div>
    </section>
  );
}

// Session Pricing Section
const sessionTypes = [
  {
    duration: '30 min',
    icon: Clock,
    description: 'Quick check-in or follow-up session',
    priceRange: '$40 - $80',
    features: ['Great for follow-ups', 'Quick mental health check', 'Focused discussion'],
    popular: false,
  },
  {
    duration: '60 min',
    icon: Video,
    description: 'Standard therapy session',
    priceRange: '$70 - $150',
    features: ['Most popular option', 'In-depth exploration', 'Full session experience'],
    popular: true,
  },
  {
    duration: '90 min',
    icon: Video,
    description: 'Extended deep-dive session',
    priceRange: '$100 - $200',
    features: ['Complex issues', 'Couples therapy', 'Intensive work'],
    popular: false,
  },
];

function SessionPricingSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Session <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Choose the session length that works for you. Prices vary by therapist experience and specialty.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {sessionTypes.map((session, index) => (
            <Card
              key={index}
              className={`relative ${session.popular ? 'border-2 border-primary-500 shadow-xl' : ''}`}
            >
              {session.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center pt-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                  <session.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900">{session.duration}</h3>
                <p className="mt-2 text-secondary-600">{session.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary-600">{session.priceRange}</span>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {session.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-secondary-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#download"
                  className={`w-full text-center block py-3 rounded-lg font-semibold transition-colors ${
                    session.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  Get Started
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instant Call Pricing Section
function InstantCallSection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
              Instant <span className="gradient-text">Call</span> Option
            </h2>
            <p className="mt-4 text-lg text-secondary-600">
              Need to talk to someone right now? Our instant call feature connects you with available therapists immediately.
            </p>

            <Card className="mt-8 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900">Per-Minute Pricing</h3>
                  <p className="text-3xl font-bold text-primary-600 mt-1">$2 - $4 /minute</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-secondary-100">
                <ul className="space-y-3">
                  {[
                    'No appointment needed',
                    'Connect in under 2 minutes',
                    'Pay only for time used',
                    'Available 24/7',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-secondary-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold">How Instant Calls Work</h3>
            <div className="mt-6 space-y-6">
              {[
                { step: '1', text: 'Open the app and tap "Instant Call"' },
                { step: '2', text: 'Get matched with an available therapist' },
                { step: '3', text: 'Start talking within 2 minutes' },
                { step: '4', text: 'End anytime - pay only for time used' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <p className="text-primary-50">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Note Section
function PricingNoteSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <Card className="max-w-4xl mx-auto bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">Pricing Varies by Therapist</h3>
              <p className="mt-2 text-secondary-600">
                Each therapist sets their own rates based on their experience, specialization, and qualifications. You can filter therapists by price range in the app to find one that fits your budget. All prices are displayed upfront before you book.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// Payment Methods Section
const paymentMethods = [
  { name: 'Credit/Debit Cards', icon: '💳' },
  { name: 'Apple Pay', icon: '🍎' },
  { name: 'Google Pay', icon: '📱' },
  { name: 'PayPal', icon: '🅿️' },
];

function PaymentMethodsSection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Payment <span className="gradient-text">Methods</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            We accept multiple payment options for your convenience.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm border border-secondary-100"
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="font-medium text-secondary-700">{method.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <span className="text-secondary-600">Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <span className="text-secondary-600">PCI compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Refund Policy Section
function RefundPolicySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 text-center">
            Refund <span className="gradient-text">Policy</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600 text-center">
            We want you to be completely satisfied with your experience.
          </p>

          <Card className="mt-12">
            <ul className="space-y-4">
              {[
                { title: 'Free cancellation', description: 'Cancel up to 24 hours before your session for a full refund.' },
                { title: 'Late cancellation', description: 'Cancellations within 24 hours may be subject to a 50% fee.' },
                { title: 'No-show policy', description: 'Missing a session without notice will result in full charge.' },
                { title: 'Unsatisfied with session?', description: 'Contact us within 24 hours and we\'ll work to make it right.' },
                { title: 'Technical issues', description: 'Full refund if session is interrupted due to our platform issues.' },
              ].map((item, index) => (
                <li key={index} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-secondary-900">{item.title}</p>
                    <p className="text-secondary-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function PricingCTA() {
  return (
    <section id="download" className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-custom text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          No Hidden Fees, Ever
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          Download the app and browse therapists with transparent pricing. Your mental health journey shouldn't break the bank.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Download App
          </a>
          <Link to="/faq" className="btn-secondary border-white text-white hover:bg-white/10">
            View FAQs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main Pricing Page Component
export default function Pricing() {
  return (
    <>
      <PricingHero />
      <SessionPricingSection />
      <InstantCallSection />
      <PricingNoteSection />
      <PaymentMethodsSection />
      <RefundPolicySection />
      <PricingCTA />
    </>
  );
}
