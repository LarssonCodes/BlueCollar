import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col animate-page-entry">
      <TopNavBar />

      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-outline-variant/30 py-16 text-center">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Legal & Agreements</span>
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">
            Terms of Service
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
            Last updated: June 10, 2026. Please read these terms of service carefully before using BlueCollar.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <main className="flex-grow max-w-3xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-12">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 sm:p-10 flex flex-col gap-8">
          
          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              1. Agreement to Terms
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              By accessing or using the BlueCollar Job Portal (the "Platform"), you agree to comply with and be bound by these Terms of Service. These terms govern your access to and use of our website, services, and mobile applications. If you do not agree, you are not permitted to use our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              2. User Roles and Accounts
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              To utilize certain features, you must register for an account. We offer two distinct user roles:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-body-md font-body-md text-on-surface-variant">
              <li>
                <strong className="text-on-surface">Workers:</strong> Individuals seeking local gigs, contract jobs, or general employment. Workers are responsible for providing accurate profiles, verification information, and professional history.
              </li>
              <li>
                <strong className="text-on-surface">Employers:</strong> Businesses or individuals looking to post jobs, search for candidates, and hire professionals. Employers are responsible for listing accurate wage descriptions, job responsibilities, and maintaining fair employment practices.
              </li>
            </ul>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mt-4">
              You agree to safeguard your credentials and remain fully responsible for all actions taken under your account.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              3. Platform Utilization and Job Postings
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              Our Platform acts as a bridge between workers and employers. The following behaviors are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-body-md font-body-md text-on-surface-variant">
              <li>Posting fake, misleading, or fraudulent job listings.</li>
              <li>Listing jobs that require workers to pay upfront fees or buy inventories.</li>
              <li>Harassing, discriminating against, or violating the safety of other users.</li>
              <li>Uploading malicious files, code, or exploiting the portal's system configurations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              4. Direct Payment and Settlement
            </h2>
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 mb-4">
              <h4 className="text-label-lg font-label-lg text-primary mb-1 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">info</span>
                Direct Connection Notice
              </h4>
              <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                BlueCollar is a direct connection portal. We do not act as an escrow, mediator, or payout handler. All payments are negotiated and settled directly between the Employer and the Worker.
              </p>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              We do not charge workers any commission or placement fees. Consequently, BlueCollar is not responsible for payment defaults, wage disputes, unfinished gigs, or damages arising during the completion of any contract.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              5. Profile Shortlisting and Contact Disclosure
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              For security, workers' direct contact information (such as phone numbers and email addresses) is concealed from general search and list views. This information is only shared with an employer once they shortlist the worker's application. Employers agree to use this disclosure strictly for hiring communication and not for advertisement or spam.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              In no event shall BlueCollar, its creators, or partners be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this Platform. This includes, but is not limited to, disputes between workers and employers, loss of data, or network interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-background mb-3">
              7. Termination of Use
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              We reserve the right, in our sole discretion, to suspend, disable, or terminate accounts that breach these Terms of Service or operate against the safety and integrity of the Platform.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
