import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col animate-page-entry">
      <TopNavBar />

      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-outline-variant/30 py-16 text-center">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
            <span className="material-symbols-outlined text-[16px]">security</span>
            <span>Security & Privacy</span>
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
            Privacy Policy
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
            Last updated: June 10, 2026. Your privacy is important to us. Here is how we manage and protect your data.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <main className="flex-grow max-w-3xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-12">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 sm:p-10 flex flex-col gap-8">
          
          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              1. Information We Collect
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              To operate the BlueCollar Job Portal effectively, we collect information directly from you:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-body-md font-body-md text-on-surface-variant">
              <li>
                <strong className="text-on-surface">Account Credentials:</strong> Email address and password details (securely hashed) when you register.
              </li>
              <li>
                <strong className="text-on-surface">Worker Profile Information:</strong> Full name, phone number, pincode, trade category (e.g. Electrician, Welder), work experience, skills, profile summary, and details of any jobs you apply for.
              </li>
              <li>
                <strong className="text-on-surface">Employer Profile Information:</strong> Company name, contact name, contact phone number, pincode, company description, and job listings you submit.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              We process your personal data for the following specific purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-body-md font-body-md text-on-surface-variant">
              <li>To allow workers to search and apply for jobs.</li>
              <li>To allow employers to post gigs and search for qualified local professionals based on trade and pincode.</li>
              <li>To display metrics, dashboards, and job applications on the Platform.</li>
              <li>To communicate important updates, account alerts, and platform notifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              We value your trust and do not sell, rent, or trade your personal information. Information is only shared under the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-body-md font-body-md text-on-surface-variant">
              <li>
                <strong className="text-on-surface">With Employers:</strong> When a worker applies for a job, their profile details are visible. However, direct contact details (phone number, email) remain concealed. This contact info is only unlocked and visible once the Employer shortlists the worker.
              </li>
              <li>
                <strong className="text-on-surface">For Legal Compliance:</strong> We may disclose data if required to do so by law or in response to valid legal requests by public authorities.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              4. Data Hosting and Security
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              All personal information, passwords, and application logs are hosted on secure, encrypted database servers (utilizing Supabase PostgreSQL services). We implement industry-standard encryption, SSL protocols, and access controls to prevent unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              5. Local Storage and Preferences
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              We use the browser's local storage to save your language selections (e.g. English, Hindi, Mizo) and theme preferences (light or dark mode) to ensure a smooth, premium, and personalized interface. We do not use cookies for tracking or advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              6. Your Control and Deletion Rights
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              You can edit, update, or remove your profile information at any time from your Profile tab or Settings menu. If you wish to delete your account and remove all personal information permanently from our servers, you can send an account deletion request to our support team or use the account options if available.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              7. Updates to This Policy
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
