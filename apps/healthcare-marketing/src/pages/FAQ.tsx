import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

// FAQ Categories and Questions
const faqCategories = [
  {
    id: 'general',
    name: 'General',
    questions: [
      {
        question: 'What is Hopefull?',
        answer: 'Hopefull is an online therapy platform that connects you with licensed mental health professionals. You can have therapy sessions via video call or chat, from the comfort of your home.',
      },
      {
        question: 'Is online therapy as effective as in-person therapy?',
        answer: 'Research shows that online therapy can be just as effective as in-person therapy for many conditions, including anxiety, depression, and stress. The key is finding the right therapist and maintaining consistent sessions.',
      },
      {
        question: 'What conditions can be treated through Hopefull?',
        answer: 'Our therapists can help with a wide range of issues including anxiety, depression, stress, relationship problems, grief, trauma, self-esteem, and many more. However, our platform is not suitable for severe mental illness requiring hospitalization or crisis intervention.',
      },
      {
        question: 'Is Hopefull available in my country?',
        answer: 'Hopefull is currently available in the United States, United Kingdom, Canada, and Australia. We\'re working on expanding to more countries. Check our app for the latest availability.',
      },
    ],
  },
  {
    id: 'users',
    name: 'For Users',
    questions: [
      {
        question: 'How do I get started?',
        answer: 'Simply download the Hopefull app, create an account, answer a few questions about your therapy goals, and browse available therapists. You can read profiles, check availability, and book your first session in minutes.',
      },
      {
        question: 'How do I choose the right therapist?',
        answer: 'You can filter therapists by specialty, language, availability, and price range. Read their profiles, watch introduction videos, and check reviews from other users. If your first choice doesn\'t feel right, you can switch therapists at any time.',
      },
      {
        question: 'Can I switch therapists?',
        answer: 'Yes! Finding the right fit is important. You can switch to a different therapist at any time at no additional cost. Simply browse available therapists and book with someone new.',
      },
      {
        question: 'What if I miss a session?',
        answer: 'If you miss a session without canceling at least 24 hours in advance, you may be charged for the full session. We recommend setting reminders and notifying your therapist if you need to reschedule.',
      },
      {
        question: 'Can I message my therapist between sessions?',
        answer: 'Yes! You can send messages to your therapist between sessions. Response times vary by therapist, but most respond within 24-48 hours during business days.',
      },
    ],
  },
  {
    id: 'therapists',
    name: 'For Therapists',
    questions: [
      {
        question: 'How do I become a therapist on Hopefull?',
        answer: 'Visit our "For Therapists" page and submit an application. You\'ll need to provide your license information, credentials, and professional background. Our team reviews applications within 48 hours.',
      },
      {
        question: 'What are the requirements to join?',
        answer: 'You must have a valid, unrestricted license to practice therapy, at least 2 years of clinical experience, professional liability insurance, and pass a background check. We also require a master\'s degree or higher in a relevant field.',
      },
      {
        question: 'How much can I earn?',
        answer: 'You set your own rates. Our therapists typically charge between $70-$150 per hour for standard sessions. Hopefull takes a 20% platform fee. Top therapists earn $8,000+ per month.',
      },
      {
        question: 'How and when do I get paid?',
        answer: 'Payments are processed weekly via direct deposit. You can track your earnings and view detailed payment history in your therapist dashboard.',
      },
      {
        question: 'What support does Hopefull provide?',
        answer: 'We provide 24/7 technical support, marketing to attract clients, a dedicated success manager, continuing education resources, and a community of fellow professionals.',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payments',
    questions: [
      {
        question: 'How much does therapy cost?',
        answer: 'Prices vary by therapist and session length. Typical rates range from $40-$80 for 30-minute sessions, $70-$150 for 60-minute sessions, and $100-$200 for 90-minute sessions. All prices are displayed before you book.',
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit and debit cards, Apple Pay, Google Pay, and PayPal. All payments are processed securely through our payment partners.',
      },
      {
        question: 'Does insurance cover online therapy?',
        answer: 'Many insurance plans now cover online therapy. We provide receipts that you can submit to your insurance for reimbursement. Check with your insurance provider for specific coverage details.',
      },
      {
        question: 'What is your refund policy?',
        answer: 'Sessions cancelled at least 24 hours in advance receive a full refund. Late cancellations may incur a 50% fee. No-shows are charged the full session rate. Technical issues on our end result in full refunds.',
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No! We believe in transparent pricing. You only pay for the sessions you book at the price shown. There are no subscription fees, signup fees, or hidden charges.',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    questions: [
      {
        question: 'What devices can I use for sessions?',
        answer: 'You can use our iOS or Android app, or access sessions via web browser on your computer. We recommend a stable internet connection and a quiet, private space.',
      },
      {
        question: 'Is my information secure?',
        answer: 'Absolutely. All sessions are end-to-end encrypted. We are HIPAA compliant and follow strict data protection standards. Your personal and health information is never shared without your consent.',
      },
      {
        question: 'What if I have technical issues during a session?',
        answer: 'If you experience technical difficulties, try refreshing the page or restarting the app. If issues persist, contact our 24/7 technical support. Sessions interrupted by our technical issues are refunded.',
      },
      {
        question: 'Can I use Hopefull on multiple devices?',
        answer: 'Yes! You can access your account from any device. Your messages, session history, and preferences sync across all your devices.',
      },
      {
        question: 'How do video sessions work?',
        answer: 'When it\'s time for your session, open the app and tap "Join Session." You\'ll enter a private, encrypted video room with your therapist. No additional software downloads required.',
      },
    ],
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  // Filter questions based on search term
  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => searchTerm === '' || category.questions.length > 0);

  const displayCategory = searchTerm
    ? filteredCategories
    : faqCategories.filter((c) => c.id === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-600">
              Find answers to common questions about Hopefull.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-secondary-200 bg-white text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Category Sidebar */}
            {!searchTerm && (
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-4">Categories</h2>
                  <nav className="space-y-2">
                    {faqCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-secondary-600 hover:bg-secondary-50'
                        }`}
                      >
                        {category.name}
                        <span className="float-right text-sm text-secondary-400">
                          {category.questions.length}
                        </span>
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>
            )}

            {/* Questions */}
            <div className={searchTerm ? 'lg:col-span-4' : 'lg:col-span-3'}>
              {searchTerm && filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-secondary-600 mb-4">No results found for "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-primary-600 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                displayCategory.map((category) => (
                  <div key={category.id} className="mb-12 last:mb-0">
                    {searchTerm && (
                      <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                        {category.name}
                      </h2>
                    )}
                    <Accordion>
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} title={faq.question}>
                          {faq.answer}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <Card className="max-w-3xl mx-auto text-center bg-white">
            <h2 className="text-2xl font-bold text-secondary-900">Still Have Questions?</h2>
            <p className="mt-4 text-secondary-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="mt-6">
              <Link to="/contact" className="btn-primary">
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
