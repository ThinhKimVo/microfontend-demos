import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  Shield,
  Headphones,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  FileCheck,
  Camera,
  BadgeCheck,
  Calculator,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Hero Section
function TherapistHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
              Grow Your Practice with <span className="gradient-text">Hopefull</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-600">
              Join thousands of licensed therapists who are helping people while enjoying flexible schedules, competitive earnings, and full support.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#apply" className="btn-primary">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link to="/how-it-works" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-4xl font-bold">2,000+</p>
                <p className="mt-2 text-primary-100">Therapists on platform</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-2xl font-bold">$5K+</p>
                    <p className="text-sm text-primary-100">Avg monthly earnings</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-2xl font-bold">4.9</p>
                    <p className="text-sm text-primary-100">Platform rating</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Benefits Section
const benefits = [
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Work when you want, where you want. Set your own hours and availability. Perfect for maintaining work-life balance.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Earnings',
    description: 'Set your own rates and earn what you\'re worth. Top therapists earn $100+ per hour with our transparent fee structure.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'HIPAA-compliant platform with end-to-end encryption. Focus on therapy while we handle the technical security.',
  },
  {
    icon: Headphones,
    title: 'Full Support',
    description: 'Dedicated support team, ongoing training resources, and a community of fellow professionals to connect with.',
  },
];

function BenefitsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Benefits of <span className="gradient-text">Joining</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Why therapists love working with Hopefull.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} hover className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <benefit.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">{benefit.title}</h3>
              <p className="mt-3 text-secondary-600">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Requirements Section
const requirements = [
  {
    icon: FileCheck,
    title: 'Valid License',
    description: 'Active, unrestricted license to practice therapy in your state/country.',
  },
  {
    icon: Camera,
    title: 'Professional Photo',
    description: 'High-quality, professional headshot for your profile.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Credentials',
    description: 'Master\'s degree or higher in relevant field, plus required certifications.',
  },
];

function RequirementsSection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            <span className="gradient-text">Requirements</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            What you need to join our network.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {requirements.map((req, index) => (
            <Card key={index} className="text-center bg-white">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <req.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">{req.title}</h3>
              <p className="mt-3 text-secondary-600">{req.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-white">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Additional Requirements:</h3>
            <ul className="space-y-3">
              {[
                'Minimum 2 years of clinical experience',
                'Professional liability insurance',
                'Reliable internet connection and quiet workspace',
                'Comfortable with technology and video conferencing',
                'Background check clearance',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="text-secondary-600">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

// How to Apply Section
const applySteps = [
  { step: '1', title: 'Submit Application', description: 'Fill out our online application form with your details and credentials.' },
  { step: '2', title: 'Document Verification', description: 'Our team verifies your license and credentials within 48 hours.' },
  { step: '3', title: 'Background Check', description: 'Complete a standard background check for safety compliance.' },
  { step: '4', title: 'Platform Training', description: 'Complete our brief onboarding course to learn the platform.' },
  { step: '5', title: 'Start Practicing', description: 'Set up your profile, availability, and start accepting clients!' },
];

function HowToApplySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            How to <span className="gradient-text">Apply</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Get started in just 5 easy steps.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {applySteps.map((step, index) => (
            <div key={index} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                {index < applySteps.length - 1 && (
                  <div className="w-0.5 h-16 bg-primary-200 mx-auto mt-2" />
                )}
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
                <p className="mt-2 text-secondary-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Earnings Calculator Section
function EarningsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [ratePerHour, setRatePerHour] = useState(80);
  const platformFee = 0.2; // 20% platform fee

  const grossEarnings = hoursPerWeek * ratePerHour * 4;
  const netEarnings = grossEarnings * (1 - platformFee);

  return (
    <section id="calculator" className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Earnings <span className="gradient-text">Calculator</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Estimate your monthly income based on your availability.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-primary-600" />
            <h3 className="text-xl font-semibold text-secondary-900">Calculate Your Potential</h3>
          </div>

          <div className="space-y-8">
            {/* Hours per week slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-secondary-700">Hours per week</label>
                <span className="text-sm font-bold text-primary-600">{hoursPerWeek} hours</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-secondary-500 mt-1">
                <span>5h</span>
                <span>40h</span>
              </div>
            </div>

            {/* Rate per hour slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-secondary-700">Rate per hour</label>
                <span className="text-sm font-bold text-primary-600">${ratePerHour}</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={ratePerHour}
                onChange={(e) => setRatePerHour(Number(e.target.value))}
                className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-secondary-500 mt-1">
                <span>$50</span>
                <span>$200</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-primary-50 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-secondary-600">Gross Monthly Earnings</p>
                  <p className="text-3xl font-bold text-secondary-900">${grossEarnings.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-secondary-600">Your Take-Home (80%)</p>
                  <p className="text-3xl font-bold text-primary-600">${netEarnings.toLocaleString()}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-secondary-500 text-center">
                *Based on {hoursPerWeek} hours/week at ${ratePerHour}/hour. Platform fee is 20%.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// Testimonials Section
const therapistTestimonials = [
  {
    name: 'Dr. Jennifer Lee',
    specialty: 'Clinical Psychologist',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    quote: 'Hopefull has allowed me to reach clients I never could before. The platform is intuitive, and the support team is fantastic.',
    rating: 5,
    earnings: '$8,000/month',
  },
  {
    name: 'Dr. Marcus Johnson',
    specialty: 'Marriage & Family Therapist',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    quote: 'The flexibility to set my own hours while maintaining a full practice has been life-changing. Highly recommend to colleagues.',
    rating: 5,
    earnings: '$6,500/month',
  },
  {
    name: 'Sarah Williams, LCSW',
    specialty: 'Licensed Clinical Social Worker',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    quote: 'I was skeptical about online therapy, but the video quality and platform tools make sessions just as effective as in-person.',
    rating: 5,
    earnings: '$5,200/month',
  },
];

function TherapistTestimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Therapist <span className="gradient-text">Success Stories</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {therapistTestimonials.map((testimonial, index) => (
            <Card key={index} hover>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-secondary-600 italic">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-500">{testimonial.specialty}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-sm text-secondary-500">Avg. Monthly Earnings</p>
                <p className="text-lg font-bold text-primary-600">{testimonial.earnings}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Apply CTA Section
function ApplyCTA() {
  return (
    <section id="apply" className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-custom text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Join Hopefull?
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          Start your application today and begin helping people from anywhere.
        </p>
        <div className="mt-8">
          <a
            href="mailto:therapists@hopefull.app?subject=Therapist Application"
            className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
        <p className="mt-4 text-sm text-primary-100">
          Average application review time: 48 hours
        </p>
      </div>
    </section>
  );
}

// Main For Therapists Page Component
export default function ForTherapists() {
  return (
    <>
      <TherapistHero />
      <BenefitsSection />
      <RequirementsSection />
      <HowToApplySection />
      <EarningsCalculator />
      <TherapistTestimonials />
      <ApplyCTA />
    </>
  );
}
