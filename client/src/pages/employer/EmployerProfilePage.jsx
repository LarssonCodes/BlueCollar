import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, createProfile, updateProfile } from '../../api/employer.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { compressImage } from '../../utils/imageCompressor.js';
import FormPageLayout from '../../components/layouts/FormPageLayout.jsx';

function EmployerProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileExists, setProfileExists] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Primary Database Fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Custom Extra Sections (Stored in localStorage)
  const [idVerified, setIdVerified] = useState(true);
  const [businessRegistered, setBusinessRegistered] = useState(true);
  const [paymentSetup, setPaymentSetup] = useState(true);
  const [hirerSummary, setHirerSummary] = useState('');

  // Custom Worksites Images and Labels
  const [worksiteImage1, setWorksiteImage1] = useState('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=500&auto=format&fit=crop');
  const [worksiteLabel1, setWorksiteLabel1] = useState('Construction Site');
  const [worksiteImage2, setWorksiteImage2] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=500&auto=format&fit=crop');
  const [worksiteLabel2, setWorksiteLabel2] = useState('Metal Workshop');
  const [worksiteImage3, setWorksiteImage3] = useState('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop');
  const [worksiteLabel3, setWorksiteLabel3] = useState('On-Site Logistics');

  // Load extra details from localStorage
  const loadEmployerDetails = (userId) => {
    try {
      const saved = localStorage.getItem(`bluecollar_employer_details_${userId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setIdVerified(data.idVerified ?? true);
        setBusinessRegistered(data.businessRegistered ?? true);
        setPaymentSetup(data.paymentSetup ?? true);
        setHirerSummary(data.hirerSummary ?? '');
        setWorksiteImage1(data.worksiteImage1 ?? 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=500&auto=format&fit=crop');
        setWorksiteLabel1(data.worksiteLabel1 ?? 'Construction Site');
        setWorksiteImage2(data.worksiteImage2 ?? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=500&auto=format&fit=crop');
        setWorksiteLabel2(data.worksiteLabel2 ?? 'Metal Workshop');
        setWorksiteImage3(data.worksiteImage3 ?? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop');
        setWorksiteLabel3(data.worksiteLabel3 ?? 'On-Site Logistics');
      }
    } catch { /* ignore parse errors */ }
  };

  const saveEmployerDetails = (userId) => {
    if (!userId) return;
    const data = {
      idVerified,
      businessRegistered,
      paymentSetup,
      hirerSummary,
      worksiteImage1,
      worksiteLabel1,
      worksiteImage2,
      worksiteLabel2,
      worksiteImage3,
      worksiteLabel3
    };
    localStorage.setItem(`bluecollar_employer_details_${userId}`, JSON.stringify(data));
  };

  // Fetch profile details on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data && res.data.success) {
          const profile = res.data.data;
          setFullName(profile.fullName || '');
          setCompanyName(profile.companyName || '');
          setPhone(profile.phone || '');
          setPincode(profile.pincode || '');
          setCity(profile.city || '');
          setProfilePicture(profile.profilePicture || '');
          setProfileExists(true);
          setIsEditing(false); // If profile exists, show view mode first
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileExists(false);
          setIsEditing(true); // If no profile, start in edit mode
        } else {
          setErrorMessage('Failed to load profile details.');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
    if (user?.id) loadEmployerDetails(user.id);
  }, [user]);

  // Success message timer
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Client-side validations
    if (fullName.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters long');
      return;
    }

    if (!/^\d{10,15}$/.test(phone)) {
      setErrorMessage('Phone number must contain between 10 and 15 digits');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setErrorMessage('Pincode must be exactly 6 digits');
      return;
    }

    if (city.trim().length < 2) {
      setErrorMessage('City name must be at least 2 characters long');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      companyName: companyName.trim() || null,
      phone: phone.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      profilePicture: profilePicture.trim() || null
    };

    setIsSaving(true);
    try {
      let res;
      if (profileExists) {
        res = await updateProfile(payload);
        setSuccessMessage('Profile updated successfully!');
      } else {
        res = await createProfile(payload);
        setProfileExists(true);
        updateUser({ hasProfile: true });
        setSuccessMessage('Profile created successfully!');
      }

      // Rehydrate local states from returned server response
      if (res.data && res.data.success) {
        const profile = res.data.data;
        setFullName(profile.fullName);
        setCompanyName(profile.companyName || '');
        setPhone(profile.phone);
        setPincode(profile.pincode);
        setCity(profile.city);
        setProfilePicture(profile.profilePicture || '');
      }

      // Save custom extra details to localStorage
      if (user?.id) saveEmployerDetails(user.id);

      setIsEditing(false); // Switch back to View Mode
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to save profile. Please check inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
          <span className="animate-spin material-symbols-outlined">sync</span>
          Loading profile details...
        </div>
      </div>
    );
  }

  // 1. VIEW MODE (Beautiful Bento Grid view)
  if (!isEditing && profileExists) {
    return (
      <div className="flex-grow flex flex-col py-6 max-w-container-max mx-auto w-full px-margin-mobile">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left Column: Employer info summary */}
          <div className="md:col-span-4 flex flex-col gap-stack-md">
            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 flex flex-col items-center text-center border border-outline-variant/30 animate-none">
              <div className="w-24 h-24 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center mb-4 overflow-hidden shadow-sm select-none">
                {profilePicture ? (
                  <img
                    alt="Employer Profile Photo"
                    className="w-full h-full object-cover"
                    src={profilePicture}
                  />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-primary font-medium">storefront</span>
                )}
              </div>
              <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold mb-3 select-none flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Hirer
              </span>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">{fullName}</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                {companyName || 'Independent Individual Hirer'}
              </p>
              
              <div className="flex flex-col gap-2.5 w-full mb-6 text-left border-t border-outline-variant/20 pt-4">
                <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> 
                  <span>{city} ({pincode})</span>
                </div>
                <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">mail</span> 
                  <span className="truncate">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">phone</span> 
                  <span>{phone}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2.5 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-level-1 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit Profile
                </button>
                <Link
                  to="/employer/jobs/new"
                  className="w-full py-2.5 px-4 bg-transparent border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  Post a New Job
                </Link>
              </div>
            </div>

            {/* Trust Credentials Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 border border-outline-variant/30">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">gavel</span> Trust Credentials
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] font-bold ${idVerified ? 'text-[#059669]' : 'text-on-surface-variant/40'}`}>
                    {idVerified ? 'check_circle' : 'pending'}
                  </span>
                  <span className={`font-body-sm text-body-sm ${idVerified ? 'text-on-surface' : 'text-on-surface-variant/60 italic'}`}>
                    Government ID Verified {idVerified ? '' : '(Pending)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] font-bold ${businessRegistered ? 'text-[#059669]' : 'text-on-surface-variant/40'}`}>
                    {businessRegistered ? 'check_circle' : 'pending'}
                  </span>
                  <span className={`font-body-sm text-body-sm ${businessRegistered ? 'text-on-surface' : 'text-on-surface-variant/60 italic'}`}>
                    Registered Business {businessRegistered ? '' : '(Pending)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] font-bold ${paymentSetup ? 'text-[#059669]' : 'text-on-surface-variant/40'}`}>
                    {paymentSetup ? 'check_circle' : 'pending'}
                  </span>
                  <span className={`font-body-sm text-body-sm ${paymentSetup ? 'text-on-surface' : 'text-on-surface-variant/60 italic'}`}>
                    Instant Payment Release Setup {paymentSetup ? '' : '(Pending)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Business Focus, Stats, Jobs, Site Gallery, Safety Guidelines */}
          <div className="md:col-span-8 flex flex-col gap-stack-lg">
            {/* Stats Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-md">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-level-1 border border-outline-variant/30 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant">Active Postings</span>
                  <span className="material-symbols-outlined text-primary text-xl p-1 bg-primary-fixed rounded-md animate-none">work</span>
                </div>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">3 Active Gigs</span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-level-1 border border-outline-variant/30 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant">Workers Hired</span>
                  <span className="material-symbols-outlined text-secondary text-xl p-1 bg-secondary-fixed rounded-md animate-none">handshake</span>
                </div>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">14 Hired</span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-level-1 border border-outline-variant/30 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant">Hirer Rating</span>
                  <span className="material-symbols-outlined text-[#059669] text-xl p-1 bg-[#D1FAE5] rounded-md animate-none">star</span>
                </div>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">4.9 / 5.0</span>
              </div>
            </div>

            {/* Business Details Card */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">domain</span> Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md mb-6">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Entity Type</p>
                  <p className="font-body-md text-body-md text-on-surface font-semibold mt-0.5">
                    {companyName ? 'Registered Enterprise' : 'Individual Hirer'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Hiring Verification</p>
                  <p className="font-body-md text-body-md text-[#059669] font-semibold mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] fill">check_circle</span>
                    Active & Verified Partner
                  </p>
                </div>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Hirer Summary</p>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-line">
                  {hirerSummary.trim() ? hirerSummary : (
                    companyName 
                      ? `${fullName} manages operations for ${companyName} in ${city}. They regularly hire skilled tradespeople (electricians, welders, plumbers) for industrial, commercial, and residential projects, focusing on safety standards and compliant execution.`
                      : `${fullName} is an active individual hirer in ${city}, looking for skilled professionals and gig workers to handle residential repairs, renovations, and maintenance projects.`
                  )}
                </p>
              </div>
            </section>

            {/* Active Listings Card */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-primary">campaign</span> Active Listings
                </h2>
                <Link to="/employer/jobs" className="font-label-md text-label-md text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center hover:shadow-level-2 transition-shadow">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Need Master Welder (TIG/MIG)</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">₹850/Day • Gig contract • {city}</p>
                  </div>
                  <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold">
                    Active
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center hover:shadow-level-2 transition-shadow">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Commercial Site Electrician</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">₹700/Day • 2 Weeks Gig • {city}</p>
                  </div>
                  <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </section>

            {/* Project Site Gallery Card */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">photo_library</span> Worksites & Operations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="aspect-video rounded-lg overflow-hidden group relative border border-outline-variant/20">
                  <img
                    alt={worksiteLabel1}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={worksiteImage1}
                  />
                  <div className="absolute inset-0 bg-black/55 opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white font-label-sm text-label-sm">{worksiteLabel1}</span>
                  </div>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden group relative border border-outline-variant/20">
                  <img
                    alt={worksiteLabel2}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={worksiteImage2}
                  />
                  <div className="absolute inset-0 bg-black/55 opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white font-label-sm text-label-sm">{worksiteLabel2}</span>
                  </div>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden group relative border border-outline-variant/20">
                  <img
                    alt={worksiteLabel3}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={worksiteImage3}
                  />
                  <div className="absolute inset-0 bg-black/55 opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white font-label-sm text-label-sm">{worksiteLabel3}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Hirer Trust & Commitment Section */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">verified_user</span> Hirer Trust & Commitments
              </h2>
              <div className="font-body-sm text-body-sm text-on-surface-variant space-y-4 font-normal">
                <p className="font-body-sm text-body-sm leading-relaxed text-on-surface font-normal">
                  To ensure a high-trust platform for skilled professional workers, all BlueCollar registered employers commit to the following guidelines:
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#059669] text-[20px] select-none font-bold">handshake</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"><strong className="font-bold">Fair Wages</strong>: Pay rates set match or exceed local market wages for the corresponding trade.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#059669] text-[20px] select-none font-bold">payments</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"><strong className="font-bold">Prompt Compensation</strong>: Release payments immediately upon successful completion of the agreed contract gig milestones.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#059669] text-[20px] select-none font-bold">health_and_safety</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"><strong className="font-bold">Safe Environment</strong>: Provide basic safety standards and a professional working environment on site.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#059669] text-[20px] select-none font-bold">description</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"><strong className="font-bold">Clear Scope</strong>: Provide accurate task descriptions and requirements in postings before workers apply.</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Profile completion calculation for sidebar
  const getCompletion = () => {
    const fields = [fullName, phone, pincode, city, companyName, profilePicture, hirerSummary];
    const filled = fields.filter((f) => f && String(f).trim()).length;
    return Math.round((filled / fields.length) * 100);
  };
  const completion = getCompletion();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <FormPageLayout
        title={profileExists ? 'Edit Employer Profile' : 'Create Employer Profile'}
        subtitle="Provide details about yourself and your business so workers can find you."
        actions={
          profileExists && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="border border-outline-variant hover:bg-surface-container-low text-on-surface rounded-saas px-4 py-2 font-label-md text-label-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              View Profile
            </button>
          )
        }
        sidebar={
          <div className="flex flex-col gap-6">
            {/* Live Preview Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-primary-container/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none">
                Live Preview
              </div>
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 font-bold uppercase tracking-wider">
                Profile Preview
              </h4>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center mb-3 overflow-hidden shadow-sm select-none">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary font-medium">storefront</span>
                  )}
                </div>
                
                <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold mb-2 select-none flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Verified Hirer
                </span>
                
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-0.5 font-bold truncate max-w-full">
                  {fullName || 'Your Name'}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 truncate max-w-full">
                  {companyName || 'Independent Individual Hirer'}
                </p>

                <div className="w-full border-t border-outline-variant/20 pt-3 flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>{city || 'City'}{pincode ? ` (${pincode})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-base">phone</span>
                    <span>{phone || 'Phone Number'}</span>
                  </div>
                </div>

                <div className="w-full border-t border-outline-variant/20 pt-3 mt-3">
                  <h5 className="font-label-sm text-label-sm text-on-surface font-semibold mb-2 text-left">
                    Trust Credentials
                  </h5>
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`material-symbols-outlined text-base font-bold ${idVerified ? 'text-[#059669]' : 'text-on-surface-variant/30'}`}>
                        {idVerified ? 'check_circle' : 'pending'}
                      </span>
                      <span className={idVerified ? 'text-on-surface font-medium' : 'text-on-surface-variant/60 italic'}>
                        Government ID Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`material-symbols-outlined text-base font-bold ${businessRegistered ? 'text-[#059669]' : 'text-on-surface-variant/30'}`}>
                        {businessRegistered ? 'check_circle' : 'pending'}
                      </span>
                      <span className={businessRegistered ? 'text-on-surface font-medium' : 'text-on-surface-variant/60 italic'}>
                        Registered Business
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`material-symbols-outlined text-base font-bold ${paymentSetup ? 'text-[#059669]' : 'text-on-surface-variant/30'}`}>
                        {paymentSetup ? 'check_circle' : 'pending'}
                      </span>
                      <span className={paymentSetup ? 'text-on-surface font-medium' : 'text-on-surface-variant/60 italic'}>
                        Instant Wage Release Setup
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion Progress Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-md text-label-md text-on-surface font-bold">Profile Strength</span>
                <span className="font-label-md text-label-md text-primary font-bold">{completion}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${completion === 100 ? 'bg-[#059669]' : 'bg-primary-container'}`}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {completion < 100
                  ? 'Complete all basic details, company names, summary bio and upload work images to unlock verified badges and attract higher quality applicants.'
                  : 'Your profile is fully completed! Ready to connect with skilled tradespeople.'}
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
              <h4 className="font-label-md text-label-md text-on-surface font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                Employer Tips
              </h4>
              <ul className="space-y-2.5 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Wages & Trust:</strong> Verified business details and active verification badges increase applicant conversion by 45%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Worksite Photos:</strong> Real site photos help workers understand the nature and safety conditions of the workspace.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Summary:</strong> Write a brief summary explaining what trade jobs you hire for and your safety standards.</span>
                </li>
              </ul>
            </div>

            {/* Form Actions Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full font-label-md text-label-md bg-primary-container text-on-primary rounded-saas py-3 hover:bg-surface-tint transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-level-1 hover:shadow-level-2 cursor-pointer font-bold"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-lg leading-none">sync</span>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">save</span>
                    Save Profile
                  </>
                )}
              </button>
              {profileExists && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-saas py-3 font-label-md text-label-md transition-all cursor-pointer font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        }
      >
        {errorMessage && (
          <div className="bg-error-container text-error border border-error/20 rounded-lg p-3.5 font-body-sm text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {errorMessage}
          </div>
        )}

        {/* Card 1: Avatar Upload Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">photo_camera</span>
            Profile Photo
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              onClick={() => document.getElementById('avatar-input').click()}
              className="w-24 h-24 rounded-full bg-surface-container overflow-hidden border-2 border-outline-variant relative group cursor-pointer select-none flex items-center justify-center bg-surface-container-low shadow-sm shrink-0"
            >
              {profilePicture ? (
                <img alt="Profile Preview" className="w-full h-full object-cover" src={profilePicture} />
              ) : (
                <span className="material-symbols-outlined text-5xl text-primary font-medium">storefront</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setErrorMessage('');
                    try {
                      const compressedDataUrl = await compressImage(file, {
                        maxWidth: 400,
                        maxHeight: 400,
                        quality: 0.7
                      });
                      setProfilePicture(compressedDataUrl);
                    } catch {
                      setErrorMessage('Failed to process/compress the selected image.');
                    }
                  }
                }}
              />
              <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-input').click()}
                  className="px-4 py-2 bg-primary-container text-on-primary hover:bg-surface-tint rounded-lg font-label-md text-label-md transition-all cursor-pointer"
                >
                  Change Photo
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={() => setProfilePicture('')}
                    className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg font-label-md text-label-md transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2.5">
                JPG, JPEG or PNG. Automatically compressed.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Basic Information Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">person</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Full Name / Contact Person
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Rajesh Kumar"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Company / Shop Name <span className="text-on-surface-variant/50 font-normal">(Optional)</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Rajesh Electricals"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 mt-3 block leading-relaxed">
            For sole traders or small shop owners, write your trading or shop name. Leaving company name blank lists you as an Individual Hirer.
          </span>
        </div>

        {/* Card 3: Contact & Location Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            Contact & Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="phone" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 9876543210"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                maxLength={6}
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6 digits"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>

            <div>
              <label htmlFor="city" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                City
              </label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Mumbai"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 mt-3 block leading-relaxed">
            Your phone number remains hidden until you shortlist a worker's application.
          </span>
        </div>

        {/* Card 4: Business Summary Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">domain</span>
            Business Focus & Summary
          </h3>
          <div>
            <label htmlFor="hirerSummary" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
              Hirer Summary / Bio
            </label>
            <textarea
              id="hirerSummary"
              rows={4}
              value={hirerSummary}
              onChange={(e) => setHirerSummary(e.target.value)}
              placeholder="Describe your enterprise, safety compliance, or types of projects you regularly hire for. If left blank, a professional summary will be automatically generated."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none text-on-surface bg-surface-container-lowest resize-none h-28 font-body-md text-body-md transition-all"
            />
          </div>
        </div>

        {/* Card 5: Verification & Trust Credentials Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">gavel</span>
            Trust Credentials & Verification
          </h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={idVerified}
                onChange={(e) => setIdVerified(e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-lowest mt-0.5 shrink-0"
              />
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold block">Government ID Verified</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Confirm that your identity has been verified with a government-issued document.</span>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer select-none pt-4 border-t border-outline-variant/10">
              <input
                type="checkbox"
                checked={businessRegistered}
                onChange={(e) => setBusinessRegistered(e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-lowest mt-0.5 shrink-0"
              />
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold block">Registered Business</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Verify that your business is legally registered (for enterprises/sole traders).</span>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer select-none pt-4 border-t border-outline-variant/10">
              <input
                type="checkbox"
                checked={paymentSetup}
                onChange={(e) => setPaymentSetup(e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-lowest mt-0.5 shrink-0"
              />
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold block">Instant Payment Release Setup</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Confirm you have registered a payment method for prompt contractor wage releases.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 6: Worksites Gallery Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">photo_library</span>
            Worksites & Operations Gallery
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 pb-3 border-b border-outline-variant/20">
            Customize the worksite images and labels shown on your profile. Paste image URLs or upload files.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Worksite 1 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low/20">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-surface-container-low">
                {worksiteImage1 ? (
                  <img src={worksiteImage1} alt="Preview 1" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">photo</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Label 1</label>
                <input
                  type="text"
                  value={worksiteLabel1}
                  onChange={(e) => setWorksiteLabel1(e.target.value)}
                  placeholder="Ex: Construction Site"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Image 1 URL / Upload</label>
                <input
                  type="text"
                  value={worksiteImage1.startsWith('data:') ? 'Local compressed image uploaded' : worksiteImage1}
                  onChange={(e) => setWorksiteImage1(e.target.value)}
                  placeholder="Paste image URL"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface truncate"
                />
                <label className="w-full text-center py-1.5 border border-dashed border-primary/40 text-primary font-semibold text-xs rounded hover:bg-primary-fixed hover:border-primary transition-all cursor-pointer block select-none">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 250, quality: 0.7 });
                          setWorksiteImage1(compressed);
                        } catch {
                          setErrorMessage('Failed to compress worksite image 1.');
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Worksite 2 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low/20">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-surface-container-low">
                {worksiteImage2 ? (
                  <img src={worksiteImage2} alt="Preview 2" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">photo</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Label 2</label>
                <input
                  type="text"
                  value={worksiteLabel2}
                  onChange={(e) => setWorksiteLabel2(e.target.value)}
                  placeholder="Ex: Workshop"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Image 2 URL / Upload</label>
                <input
                  type="text"
                  value={worksiteImage2.startsWith('data:') ? 'Local compressed image uploaded' : worksiteImage2}
                  onChange={(e) => setWorksiteImage2(e.target.value)}
                  placeholder="Paste image URL"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface truncate"
                />
                <label className="w-full text-center py-1.5 border border-dashed border-primary/40 text-primary font-semibold text-xs rounded hover:bg-primary-fixed hover:border-primary transition-all cursor-pointer block select-none">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 250, quality: 0.7 });
                          setWorksiteImage2(compressed);
                        } catch {
                          setErrorMessage('Failed to compress worksite image 2.');
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Worksite 3 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low/20">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-surface-container-low">
                {worksiteImage3 ? (
                  <img src={worksiteImage3} alt="Preview 3" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">photo</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Label 3</label>
                <input
                  type="text"
                  value={worksiteLabel3}
                  onChange={(e) => setWorksiteLabel3(e.target.value)}
                  placeholder="Ex: Logistics"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Image 3 URL / Upload</label>
                <input
                  type="text"
                  value={worksiteImage3.startsWith('data:') ? 'Local compressed image uploaded' : worksiteImage3}
                  onChange={(e) => setWorksiteImage3(e.target.value)}
                  placeholder="Paste image URL"
                  className="border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface truncate"
                />
                <label className="w-full text-center py-1.5 border border-dashed border-primary/40 text-primary font-semibold text-xs rounded hover:bg-primary-fixed hover:border-primary transition-all cursor-pointer block select-none">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 250, quality: 0.7 });
                          setWorksiteImage3(compressed);
                        } catch {
                          setErrorMessage('Failed to compress worksite image 3.');
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </FormPageLayout>
    </form>
  );
}

export default EmployerProfilePage;
