import { useState, useMemo } from 'react';
import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';

const FAQ_ITEMS = [
  {
    id: 'post-job',
    icon: 'post_add',
    title: 'How to post a job?',
    category: 'Employers',
    answer: 'To post a job, register or log in as an Employer, go to your dashboard, and click "Post a New Job". Fill in details such as trade category, job description, location pincode, start date, and salary/pay structure. Once submitted, your post is instantly visible to all qualified workers in that trade.',
  },
  {
    id: 'get-paid',
    icon: 'payments',
    title: 'How do I get paid?',
    category: 'Workers',
    answer: 'Payments are settled directly between the Employer and the Worker based on the terms specified in the job posting (either Daily or Monthly). BlueCollar does not charge commission or deduct any fees from your earnings.',
  },
  {
    id: 'reset-pwd',
    icon: 'lock_reset',
    title: 'Resetting your password',
    category: 'Account',
    answer: 'If you forgot your password, go to the Login page and click on "Forgot Password". Enter your registered email address and we will send you a reset link. Alternatively, if you are already logged in, you can update your password from the Security section of the Settings page.',
  },
  {
    id: 'verify-proc',
    icon: 'verified_user',
    title: 'Worker verification process',
    category: 'Workers',
    answer: 'To verify your profile, complete your worker profile details (including trade experience, pincode location, and contact details). verified profiles rank higher in employer search results and have a significantly higher chance of being shortlisted.',
  },
  {
    id: 'update-profile',
    icon: 'manage_accounts',
    title: 'Updating profile details',
    category: 'Account',
    answer: 'You can update your profile information anytime. For workers, head to the "Worker Profile" tab. For employers, visit the "Employer Profile" tab. There you can edit bio, skills, company name, phone number, and location details.',
  },
  {
    id: 'manage-app',
    icon: 'group_work',
    title: 'Managing job applicants',
    category: 'Employers',
    answer: 'Employers can track applications directly in their dashboard under the "Applicant Pipeline" tab for each job. From there, you can view worker profiles, read cover notes, and shortlist or reject candidates. Shortlisting reveals the worker\'s contact details.',
  },
];

function FAQCard({ faq, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`bg-surface-container-lowest rounded-xl border transition-all duration-300 p-6 cursor-pointer select-none
        ${isOpen 
          ? 'border-primary shadow-level-2 ring-1 ring-primary/10' 
          : 'border-outline-variant/30 hover:border-outline-variant hover:shadow-level-1'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${isOpen ? 'bg-primary/10 text-primary' : 'bg-surface text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">{faq.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center gap-2">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline mb-1 block">
              {faq.category}
            </span>
            <span className={`material-symbols-outlined transition-transform duration-300 text-outline
              ${isOpen ? 'rotate-180 text-primary' : ''}`}>
              expand_more
            </span>
          </div>
          <h4 className="text-headline-sm font-headline-sm text-on-surface mb-2">
            {faq.title}
          </h4>
          <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFAQ, setActiveFAQ] = useState(null);
  
  // Contact Support State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(faq =>
      faq.title.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavBar />

      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-outline-variant/30 py-16 text-center">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Support Center</span>
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
            How can we help you today?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-lg">
            Search our knowledge base or submit a request directly to our customer support team.
          </p>
          <div className="relative w-full max-w-lg">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm font-body-md text-body-md placeholder:text-outline"
            />
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* FAQ Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-headline-md font-headline-md text-on-background">
                Popular Questions
              </h2>
              {searchQuery && (
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-outline text-5xl select-none">find_in_page</span>
                <p className="font-body-md text-body-md text-on-surface-variant">No help articles matched your search query.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary font-label-md text-label-md hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredFAQs.map(faq => (
                  <FAQCard
                    key={faq.id}
                    faq={faq}
                    isOpen={activeFAQ === faq.id}
                    onToggle={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-level-1 flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-1">
                Contact Support
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Send us a message and our support team will reply within 24 hours.
              </p>

              {submitSuccess && (
                <div className="mb-6 bg-[#D1FAE5] text-[#065F46] p-4 rounded-lg flex items-start gap-3 border border-[#A7F3D0] animate-fade-in">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  <div>
                    <h5 className="font-label-md text-label-md font-bold">Message Sent!</h5>
                    <p className="font-body-sm text-body-sm mt-1">Thank you, we received your support request.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body-sm bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body-sm bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body-sm bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg font-body-sm bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-container text-on-primary rounded-lg py-2.5 font-label-md text-label-md hover:bg-surface-tint shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
