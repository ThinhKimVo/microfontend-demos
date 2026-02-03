import { Link } from 'react-router-dom';
import {
  Smartphone,
  Search,
  Calendar,
  Video,
  MessageSquare,
  Star,
  FileCheck,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  UserPlus,
  BadgeCheck,
  Settings,
  CreditCard,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

// Hero Section
function HowItWorksHero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
            How <span className="gradient-text">Hopefull</span> Works
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-secondary-600">
            Getting started with online therapy is simple. Whether you're a user seeking support or a therapist looking to help others, we've made the process seamless.
          </p>
        </div>
      </div>
    </section>
  );
}

// User Steps Section
const userSteps = [
  {
    number: '01',
    icon: Smartphone,
    title: 'Download & Register',
    description: 'Download the Hopefull app and create your account. Tell us about yourself and your therapy goals through a brief questionnaire.',
    details: ['Available on iOS and Android', 'Takes less than 5 minutes', 'Secure and confidential'],
  },
  {
    number: '02',
    icon: Search,
    title: 'Find Your Therapist',
    description: 'Browse our network of licensed therapists. Filter by specialty, language, availability, and read reviews from other users.',
    details: ['2,000+ verified therapists', 'Various specialties available', 'Read authentic reviews'],
  },
  {
    number: '03',
    icon: Calendar,
    title: 'Book a Session',
    description: 'Choose a time that works for you. Our therapists offer flexible scheduling including evenings and weekends.',
    details: ['24/7 availability options', 'Easy rescheduling', 'Reminder notifications'],
  },
  {
    number: '04',
    icon: Video,
    title: 'Start Your Session',
    description: 'Connect with your therapist via HD video call or secure chat. Sessions are private, encrypted, and conducted on our secure platform.',
    details: ['HD video quality', 'End-to-end encryption', 'No downloads required'],
  },
  {
    number: '05',
    icon: MessageSquare,
    title: 'Continue the Journey',
    description: 'Message your therapist between sessions, track your progress, and book follow-up appointments with ease.',
    details: ['Unlimited messaging', 'Progress tracking', 'Session notes access'],
  },
];

function UserStepsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            For <span className="gradient-text">Users</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Your journey to better mental health in 5 simple steps.
          </p>
        </div>

        <div className="space-y-8">
          {userSteps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 lg:w-1/3">
                <span className="text-6xl font-bold text-primary-100">{step.number}</span>
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <Card className="lg:w-2/3">
                <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
                <p className="mt-2 text-secondary-600">{step.description}</p>
                <ul className="mt-4 flex flex-wrap gap-4">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-secondary-500">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Therapist Steps Section
const therapistSteps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Apply to Join',
    description: 'Submit your application with your license details, credentials, and professional background. Our team reviews applications within 48 hours.',
    details: ['Quick online application', '48-hour review time', 'Background check included'],
  },
  {
    number: '02',
    icon: BadgeCheck,
    title: 'Get Verified',
    description: 'We verify your license, credentials, and conduct a background check. Once approved, you\'ll complete platform training.',
    details: ['License verification', 'Credential check', 'Platform onboarding'],
  },
  {
    number: '03',
    icon: Settings,
    title: 'Set Your Availability',
    description: 'Configure your schedule, set your rates, and create your professional profile. You\'re in control of when and how much you work.',
    details: ['Flexible scheduling', 'Set your own rates', 'Complete profile customization'],
  },
  {
    number: '04',
    icon: Calendar,
    title: 'Accept Bookings',
    description: 'Users will find and book sessions with you. You\'ll receive notifications and can manage your calendar from our app.',
    details: ['Instant notifications', 'Easy calendar management', 'Client matching'],
  },
  {
    number: '05',
    icon: CreditCard,
    title: 'Earn & Get Paid',
    description: 'Conduct sessions and get paid weekly via direct deposit. Track your earnings and view detailed payment history.',
    details: ['Weekly payouts', 'Transparent fees', 'Detailed analytics'],
  },
];

function TherapistStepsSection() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            For <span className="gradient-text">Therapists</span>
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Join our platform and start helping people in 5 steps.
          </p>
        </div>

        <div className="space-y-8">
          {therapistSteps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 lg:w-1/3">
                <span className="text-6xl font-bold text-primary-100">{step.number}</span>
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <Card className="lg:w-2/3 bg-white">
                <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
                <p className="mt-2 text-secondary-600">{step.description}</p>
                <ul className="mt-4 flex flex-wrap gap-4">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-secondary-500">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/for-therapists" className="btn-primary">
            Apply as Therapist
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
const faqs = [
  {
    question: 'How do I know if online therapy is right for me?',
    answer: 'Online therapy is effective for most people dealing with anxiety, depression, stress, relationship issues, and many other concerns. If you\'re in crisis or need in-person care, we recommend seeking local emergency services.',
  },
  {
    question: 'Are the therapists really licensed?',
    answer: 'Yes, all therapists on our platform are licensed professionals. We verify credentials, conduct background checks, and ensure ongoing compliance with licensing requirements.',
  },
  {
    question: 'How long are therapy sessions?',
    answer: 'Sessions are typically 30, 60, or 90 minutes depending on your preference and therapist availability. You can choose the duration that works best for you.',
  },
  {
    question: 'Can I switch therapists?',
    answer: 'Absolutely! Finding the right fit is important. You can switch therapists at any time at no additional cost.',
  },
  {
    question: 'Is my information kept confidential?',
    answer: 'Yes, we take privacy seriously. All sessions are encrypted, and we comply with HIPAA regulations. Your information is never shared without your consent.',
  },
  {
    question: 'What if I need to cancel a session?',
    answer: 'You can cancel or reschedule sessions up to 24 hours before the appointment time without any charge.',
  },
];

function FAQSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-secondary-600 mb-4">Still have questions?</p>
          <Link to="/faq" className="btn-outline">
            View All FAQs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function HowItWorksCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container-custom text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Get Started?
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          Download the app and take the first step towards better mental health.
        </p>
        <div className="mt-8">
          <a href="#download" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Download App
          </a>
        </div>
      </div>
    </section>
  );
}

// Main How It Works Page Component
export default function HowItWorks() {
  return (
    <>
      <HowItWorksHero />
      <UserStepsSection />
      <TherapistStepsSection />
      <FAQSection />
      <HowItWorksCTA />
    </>
  );
}
