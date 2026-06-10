import { useState, useEffect } from 'react';
import { getProfile, createProfile, updateProfile } from '../../api/worker.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { compressImage } from '../../utils/imageCompressor.js';
import FormPageLayout from '../../components/layouts/FormPageLayout.jsx';

const TRADE_CATEGORIES = [
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'MECHANIC', label: 'Mechanic' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'OTHER', label: 'Other' }
];



function WorkerProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileExists, setProfileExists] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('ELECTRICIAN');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [profilePicture, setProfilePicture] = useState('');

  // Experience Detail Fields (stored in localStorage)
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [currentStartDate, setCurrentStartDate] = useState('');
  const [prevJobTitle, setPrevJobTitle] = useState('');
  const [prevCompany, setPrevCompany] = useState('');
  const [prevDuration, setPrevDuration] = useState('');
  const [prevDescription, setPrevDescription] = useState('');

  // Load experience details from localStorage
  const loadExperienceDetails = (userId) => {
    try {
      const saved = localStorage.getItem(`bluecollar_exp_${userId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setCurrentJobTitle(data.currentJobTitle || '');
        setCurrentEmployer(data.currentEmployer || '');
        setCurrentStartDate(data.currentStartDate || '');
        setPrevJobTitle(data.prevJobTitle || '');
        setPrevCompany(data.prevCompany || '');
        setPrevDuration(data.prevDuration || '');
        setPrevDescription(data.prevDescription || '');
      }
    } catch { /* ignore parse errors */ }
  };

  const saveExperienceDetails = () => {
    if (!user?.id) return;
    const data = {
      currentJobTitle,
      currentEmployer,
      currentStartDate,
      prevJobTitle,
      prevCompany,
      prevDuration,
      prevDescription
    };
    localStorage.setItem(`bluecollar_exp_${user.id}`, JSON.stringify(data));
  };

  // Fetch profile details on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data && res.data.success) {
          const profile = res.data.data;
          setFullName(profile.fullName || '');
          setPhone(profile.phone || '');
          setTrade(profile.trade || 'ELECTRICIAN');
          setPincode(profile.pincode || '');
          setCity(profile.city || '');
          setState(profile.state || '');
          setExperience(profile.experience !== undefined ? String(profile.experience) : '');
          setBio(profile.bio || '');
          setSkills(profile.skills ? profile.skills.join(', ') : '');
          setIsAvailable(profile.isAvailable !== undefined ? profile.isAvailable : true);
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
    if (user?.id) loadExperienceDetails(user.id);
  }, []);

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
    if (!/^\d{10,15}$/.test(phone)) {
      setErrorMessage('Phone number must contain between 10 and 15 digits');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setErrorMessage('Pincode must be exactly 6 digits');
      return;
    }

    const expValue = parseInt(experience, 10);
    if (isNaN(expValue) || expValue < 0) {
      setErrorMessage('Experience in years must be a positive integer');
      return;
    }

    // Split skills by comma and clean up empty tags
    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      setErrorMessage('Please enter at least one skill');
      return;
    }

    const payload = {
      fullName,
      phone,
      trade,
      pincode,
      city,
      state,
      experience: expValue,
      bio,
      skills: skillsArray,
      isAvailable,
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
        setPhone(profile.phone);
        setTrade(profile.trade);
        setPincode(profile.pincode);
        setCity(profile.city);
        setState(profile.state);
        setExperience(String(profile.experience));
        setBio(profile.bio);
        setSkills(profile.skills.join(', '));
        setIsAvailable(profile.isAvailable);
        setProfilePicture(profile.profilePicture || '');
      }
      saveExperienceDetails(); // Persist experience details to localStorage
      setIsEditing(false); // Switch to View Mode
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to save profile. Please check inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTradeLabel = (val) => {
    const category = TRADE_CATEGORIES.find((t) => t.value === val);
    return category ? category.label : val;
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

  // 1. VIEW MODE (Beautiful Bento Grid exactly matching the mockup)
  if (!isEditing && profileExists) {
    const currentTrade = getTradeLabel(trade);
    const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);

    return (
      <div className="flex-grow flex flex-col py-6 max-w-container-max mx-auto w-full px-margin-mobile">
        {/* Success Alert Banner inside content container */}
        {successMessage && (
          <div className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left Column: Profile Card & Core Skills */}
          <div className="md:col-span-4 flex flex-col gap-stack-md">
            {/* Bento Card 1: Main Stats Profile Summary */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 flex flex-col items-center text-center border border-outline-variant/30">
              <div className="relative mb-4">
                <img
                  alt="Worker Profile Photo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm"
                  src={profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuAvyPCzF8rFXiUsBR8U5XYJUbDl4jaafdaQRQUnFApqi_6H-eG5vleL3ySf41m1wScSjzhyKkJkJxNZaJD1Q45JZVe19uzecqeHI-zQJrbxyiFr6mwJf5vWiFOm89Chw-m91lpReya-xIkP83ATsh27z9I5QbyjLOCPIrtZP6c4kLhyDGbjIeAtjE3Yx88k-CHR4nmyxLW79zTIMdr6iWgIjNbRgXpkPlaYCIt1awKGTItsJtm2v9-D2FrbdAe1X2tJMSmz8TwGjY"}
                />
                <span className="absolute bottom-0 right-2 bg-[#D1FAE5] text-[#059669] rounded-full p-1 border-2 border-surface-container-lowest flex items-center justify-center" title="Verified Professional">
                  <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                </span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">{fullName}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">{currentTrade} Specialist</p>
              
              <div className="flex flex-col gap-2 w-full mb-6 text-left md:text-center">
                <div className="flex items-center justify-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> 
                  <span>{city}, {state} ({pincode})</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">mail</span> 
                  <span className="truncate">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">phone</span> 
                  <span>{phone}</span>
                </div>
                {isAvailable ? (
                  <div className="flex items-center justify-center gap-2 text-[#059669] font-body-sm text-body-sm mt-1">
                    <span className="material-symbols-outlined text-[18px] fill">check_circle</span>
                    <span className="font-semibold">Available for Work</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-on-surface-variant/70 font-body-sm text-body-sm mt-1">
                    <span className="material-symbols-outlined text-[18px]">do_not_disturb_on</span>
                    <span>Busy / Engaged</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-all shadow-level-1 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit Profile
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full py-2 px-4 bg-transparent border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Download Resume
                </button>
              </div>
            </div>

            {/* Core Skills Bento Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 border border-outline-variant/30">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">build</span> Core Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-3 py-1 rounded font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Experience, Certifications, Portfolio & Reviews */}
          <div className="md:col-span-8 flex flex-col gap-stack-lg">
            {/* Experience Card */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">work_history</span> Experience
              </h2>
              <div className="relative border-l-2 border-surface-container-high ml-3">
                {/* Timeline Item 1 - Current Role */}
                <div className={`ml-6 relative ${(prevJobTitle || prevCompany) ? 'mb-8' : ''}`}>
                  <span className="absolute -left-[35px] top-1 bg-surface-container-lowest border-2 border-primary-container rounded-full w-4 h-4"></span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{currentJobTitle || `Senior ${currentTrade}`}</h3>
                  <p className="font-label-md text-label-md text-primary mb-1">{currentEmployer || 'Contract / Self-Employed'}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    {currentStartDate || 'Present'} - Present • {city}, {state} ({experience} Years Active)
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">{bio}</p>
                </div>
                
                {/* Timeline Item 2 - Previous Role (only shown if user filled it in) */}
                {(prevJobTitle || prevCompany) && (
                  <div className="ml-6 relative mt-8">
                    <span className="absolute -left-[35px] top-1 bg-surface-container-lowest border-2 border-outline-variant rounded-full w-4 h-4"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{prevJobTitle || `${currentTrade} Apprentice`}</h3>
                    <p className="font-label-md text-label-md text-primary mb-1">{prevCompany || 'Previous Employer'}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">{prevDuration || 'Previously'}</p>
                    {prevDescription && (
                      <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">{prevDescription}</p>
                    )}
                  </div>
                )}
              </div>
            </section>



            {/* Reviews Section */}
            <section className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30 font-body-sm text-body-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">star</span> Reviews (4.9)
              </h2>
              <div className="flex flex-col gap-6">
                {/* Review 1 */}
                <div className="pb-6 border-b border-surface-container-high last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sarah Jenkins</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Project Manager at Apex Build</p>
                    </div>
                    <div className="flex text-orange-500">
                      <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                    "{fullName} is an exceptional professional. Their attention to detail on our recent building project was outstanding. They led construction works efficiently and finished ahead of schedule."
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // 2. EDIT FORM MODE (Standard entry layout)
  // Profile completion calculation for sidebar
  const getCompletion = () => {
    const fields = [fullName, phone, pincode, city, state, experience, bio, skills, profilePicture];
    const filled = fields.filter((f) => f && String(f).trim()).length;
    return Math.round((filled / fields.length) * 100);
  };
  const completion = getCompletion();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <FormPageLayout
        title={profileExists ? 'Edit Worker Profile' : 'Create Worker Profile'}
        subtitle="Provide your trade details, experience, and contact numbers for local employers."
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
            {/* Live Worker Card Preview */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-primary-container/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none">
                Live Preview
              </div>
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 font-bold uppercase tracking-wider">
                Worker Card Preview
              </h4>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center mb-3 overflow-hidden shadow-sm select-none">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary font-medium">person</span>
                  )}
                </div>
                
                {isAvailable ? (
                  <span className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold mb-2 select-none flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                    Available Now
                  </span>
                ) : (
                  <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold mb-2 select-none">
                    Busy / Not Available
                  </span>
                )}
                
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-0.5 font-bold truncate max-w-full">
                  {fullName || 'Your Name'}
                </h3>
                <p className="font-label-md text-label-md text-primary font-semibold mb-4">
                  {getTradeLabel(trade)} {experience ? `• ${experience} Years Exp` : ''}
                </p>

                <div className="w-full border-t border-outline-variant/20 pt-3 flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>{city || 'City'}{state ? `, ${state}` : ''}{pincode ? ` (${pincode})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-base">phone</span>
                    <span>{phone || 'Phone Number'}</span>
                  </div>
                </div>

                {/* Live Skills Preview */}
                {skills && (
                  <div className="w-full border-t border-outline-variant/20 pt-3 mt-3">
                    <h5 className="font-label-sm text-label-sm text-on-surface font-semibold mb-2 text-left">
                      Skills & Services
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {skills.split(',').map((skill, index) => {
                        const trimmed = skill.trim();
                        if (!trimmed) return null;
                        return (
                          <span
                            key={index}
                            className="bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded border border-outline-variant/20"
                          >
                            {trimmed}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Strength Card */}
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
                  ? 'Complete your profile details, photo, and previous jobs list to earn verified badges and receive 3x more recruiter contacts.'
                  : 'Your profile is fully completed! You will rank higher in employer candidate searches.'}
              </p>
            </div>

            {/* Worker Tips Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
              <h4 className="font-label-md text-label-md text-on-surface font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                Worker Tips
              </h4>
              <ul className="space-y-2.5 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Availability Toggle:</strong> Keep your availability toggle set to "Available Now" so hirers filtering for instant hire can contact you immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Pincode Accuracy:</strong> Ensure your pincode matches your actual working location so local job matches are accurate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Work History:</strong> Listing even a single previous project in your experience list builds high trust.</span>
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

        {/* Card 1: Profile Photo Card */}
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
                <span className="material-symbols-outlined text-5xl text-primary font-medium">person</span>
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

        {/* Card 2: Basic Contact Details */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">person</span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Full Name
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
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 mt-3 block leading-relaxed">
            Your phone number is hidden and only revealed to employers when they shortlist you for active gigs.
          </span>
        </div>

        {/* Card 3: Trade & Professional Credentials */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">build</span>
            Trade & Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="trade" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Primary Trade Category
              </label>
              <select
                id="trade"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              >
                {TRADE_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Total Experience (in Years)
              </label>
              <input
                id="experience"
                type="number"
                min={0}
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex: 5"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="skills" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
              Key Skills / Services
            </label>
            <input
              id="skills"
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ex: house wiring, industrial cabling, repair work"
              className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant/70 mt-2 block leading-relaxed">
              Separate different services or specializations with commas.
            </span>
          </div>
        </div>

        {/* Card 4: Location Details */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            Local Worksite Coverage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label htmlFor="state" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                State
              </label>
              <input
                id="state"
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Ex: Maharashtra"
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Profile Summary Bio */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">description</span>
            Profile Summary / Bio
          </h3>
          <div>
            <label htmlFor="bio" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
              Professional Summary
            </label>
            <textarea
              id="bio"
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: I am an electrician with over 5 years of experience in residential wiring and maintenance. I have worked on commercial sites and handle power grids, wiring, and panel installations..."
              className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
            />
          </div>
        </div>

        {/* Card 6: Work History Timeline */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1 flex flex-col gap-6">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-primary">work_history</span>
              Experience & Work History
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Provide current and previous jobs to display on your interactive profile timeline.
            </p>
          </div>

          {/* Current Job Role */}
          <div className="bg-surface-container-low/50 rounded-xl p-5 border border-outline-variant/20 flex flex-col gap-4">
            <h4 className="font-label-md text-label-md text-primary font-bold flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Current Role
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentJobTitle" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Job Title
                </label>
                <input
                  id="currentJobTitle"
                  type="text"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  placeholder="Ex: Senior Electrician"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
              <div>
                <label htmlFor="currentEmployer" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Employer / Company Name
                </label>
                <input
                  id="currentEmployer"
                  type="text"
                  value={currentEmployer}
                  onChange={(e) => setCurrentEmployer(e.target.value)}
                  placeholder="Ex: Self-Employed or ABC Corp"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentStartDate" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Start Date
                </label>
                <input
                  id="currentStartDate"
                  type="text"
                  value={currentStartDate}
                  onChange={(e) => setCurrentStartDate(e.target.value)}
                  placeholder="Ex: Jan 2021"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Previous Job Role */}
          <div className="bg-surface-container-low/30 rounded-xl p-5 border border-dashed border-outline-variant/30 flex flex-col gap-4">
            <h4 className="font-label-md text-label-md text-on-surface-variant font-bold flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-base">history</span>
              Previous Role <span className="text-on-surface-variant/40 font-normal lowercase">(optional)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prevJobTitle" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Job Title
                </label>
                <input
                  id="prevJobTitle"
                  type="text"
                  value={prevJobTitle}
                  onChange={(e) => setPrevJobTitle(e.target.value)}
                  placeholder="Ex: Junior Welder"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
              <div>
                <label htmlFor="prevCompany" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Company / Employer Name
                </label>
                <input
                  id="prevCompany"
                  type="text"
                  value={prevCompany}
                  onChange={(e) => setPrevCompany(e.target.value)}
                  placeholder="Ex: BuildRight Contractors"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prevDuration" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                  Duration
                </label>
                <input
                  id="prevDuration"
                  type="text"
                  value={prevDuration}
                  onChange={(e) => setPrevDuration(e.target.value)}
                  placeholder="Ex: Mar 2017 - Dec 2020"
                  className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface"
                />
              </div>
            </div>
            <div>
              <label htmlFor="prevDescription" className="font-label-md text-label-md text-on-surface-variant mb-2 block font-semibold">
                Responsibilities Description
              </label>
              <textarea
                id="prevDescription"
                rows={3}
                value={prevDescription}
                onChange={(e) => setPrevDescription(e.target.value)}
                placeholder="Briefly describe what tasks you handled, safety certs used, or projects completed..."
                className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface resize-none"
              />
            </div>
          </div>
        </div>

        {/* Card 7: Instant Availability Toggle */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 font-semibold flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <span className="material-symbols-outlined text-primary">circle_notifications</span>
            Availability Status
          </h3>
          <label className="flex items-center gap-3.5 cursor-pointer select-none">
            <input
              id="isAvailable"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-lowest"
            />
            <div>
              <span className="font-label-md text-label-md text-on-surface font-semibold block">Available for work immediately</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Check this to enable the "Available" pulse badge on searches, allowing recruiters to hire you instantly.</span>
            </div>
          </label>
        </div>
      </FormPageLayout>
    </form>
  );
}

export default WorkerProfilePage;
