import { useState, useEffect, useRef, useCallback } from 'react';
import { updatePassword } from '../../api/auth.js';
import { 
  getProfile as getWorkerProfile, 
  createProfile as createWorkerProfile,
  updateProfile as updateWorkerProfile 
} from '../../api/worker.js';
import { 
  getProfile as getEmployerProfile,
  createProfile as createEmployerProfile,
  updateProfile as updateEmployerProfile
} from '../../api/employer.js';
import { getMe } from '../../api/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { compressImage } from '../../utils/imageCompressor.js';
import FormPageLayout from '../../components/layouts/FormPageLayout.jsx';

// ─── Password Strength Calculator ───────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-error' };
  if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-[#EA580C]' };
  if (score <= 4) return { score: 3, label: 'Good', color: 'bg-primary-container' };
  return { score: 4, label: 'Strong', color: 'bg-[#059669]' };
}

const LABEL_COLORS = {
  Weak: 'text-error',
  Fair: 'text-[#EA580C]',
  Good: 'text-primary-container',
  Strong: 'text-[#059669]'
};

// ─── Section IDs ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'account', label: 'Profile Info', icon: 'person' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'visibility', label: 'Visibility', icon: 'toggle_on' },
  { id: 'data', label: 'Data Management', icon: 'database' },
  { id: 'danger', label: 'Danger Zone', icon: 'report_problem' }
];

// ─── Toggle Switch Component ────────────────────────────────────────────────
function ToggleSwitch({ id, checked, onChange, disabled }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary-container' : 'bg-surface-container-high'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-level-1 ring-0 transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Main Settings Page ─────────────────────────────────────────────────────
function SettingsPage() {
  const { user } = useAuth();

  // ── Account & Profile data ──
  const [accountData, setAccountData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);

  // ── Basic Information Form States ──
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // ── Password Form States ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Visibility Toggles ──
  const [isAvailable, setIsAvailable] = useState(true);
  const [showInSearch, setShowInSearch] = useState(true);
  const [acceptApplications, setAcceptApplications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [visibilitySuccess, setVisibilitySuccess] = useState('');

  // ── Danger Zone ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // ── Section Refs for Scroll-Tracking ──
  const sectionRefs = {
    account: useRef(null),
    security: useRef(null),
    visibility: useRef(null),
    data: useRef(null),
    danger: useRef(null)
  };
  const [activeSection, setActiveSection] = useState('account');

  // ── Fetch Account & Profile Data ──
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAccount(true);
      try {
        const meRes = await getMe();
        if (meRes.data?.success) {
          setAccountData(meRes.data.data);
        }
      } catch { /* fallback to auth context */ }

      try {
        if (user?.role === 'WORKER') {
          const profileRes = await getWorkerProfile();
          if (profileRes.data?.success) {
            const p = profileRes.data.data;
            setProfileData(p);
            setIsAvailable(p.isAvailable !== undefined ? p.isAvailable : true);

            // Populate form states
            const nameParts = (p.fullName || '').trim().split(/\s+/);
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setBio(p.bio || '');
            setProfilePicture(p.profilePicture || '');
          }
        } else if (user?.role === 'EMPLOYER') {
          const profileRes = await getEmployerProfile();
          if (profileRes.data?.success) {
            const p = profileRes.data.data;
            setProfileData(p);

            // Populate form states
            const nameParts = (p.fullName || '').trim().split(/\s+/);
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setCompanyName(p.companyName || '');
            setProfilePicture(p.profilePicture || '');
          }
        }
      } catch { /* profile details might not exist yet */ }

      // Load visibility settings from localStorage
      const prefs = localStorage.getItem(`bluecollar_visibility_${user?.id}`);
      if (prefs) {
        try {
          const parsed = JSON.parse(prefs);
          setShowInSearch(parsed.showInSearch ?? true);
          setAcceptApplications(parsed.acceptApplications ?? true);
          setProfileVisible(parsed.profileVisible ?? true);
        } catch { /* ignore */ }
      }

      setIsLoadingAccount(false);
    };

    if (user) fetchData();
  }, [user]);

  // ── Scroll to Section on Tab Click ──
  const scrollToSection = useCallback((id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ── Intersection Observer to Highlight Active Tab ──
  useEffect(() => {
    if (isLoadingAccount) return;
    const observers = [];
    const options = { rootMargin: '-100px 0px -60% 0px', threshold: 0 };

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      }, options);
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isLoadingAccount]);

  // ── Auto-dismiss Success/Error Banners ──
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  useEffect(() => {
    if (visibilitySuccess) {
      const timer = setTimeout(() => setVisibilitySuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [visibilitySuccess]);

  // ── Photo Upload Trigger & Canvas Compression ──
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProfileError('');
      const compressedBase64 = await compressImage(file, {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7
      });
      setProfilePicture(compressedBase64);
    } catch {
      setProfileError('Failed to upload/compress image. Please select a valid image file.');
    }
  };

  // ── Save Basic Information Profile Details ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (combinedName.length < 2) {
      setProfileError('Name must be at least 2 characters long.');
      return;
    }

    setIsSavingProfile(true);
    const hasProfile = !!profileData;

    try {
      let res;
      if (user?.role === 'WORKER') {
        const payload = {
          fullName: combinedName,
          bio: bio.trim(),
          profilePicture: profilePicture || null,
          ...(hasProfile ? {} : {
            phone: '0000000000',
            pincode: '000000',
            city: 'Default City',
            state: 'Default State',
            trade: 'OTHER',
            experience: 0,
            skills: ['General']
          })
        };
        
        if (hasProfile) {
          res = await updateWorkerProfile(payload);
        } else {
          res = await createWorkerProfile(payload);
        }
      } else if (user?.role === 'EMPLOYER') {
        const payload = {
          fullName: combinedName,
          companyName: companyName.trim() || null,
          profilePicture: profilePicture || null,
          ...(hasProfile ? {} : {
            phone: '0000000000',
            pincode: '000000',
            city: 'Default City'
          })
        };

        if (hasProfile) {
          res = await updateEmployerProfile(payload);
        } else {
          res = await createEmployerProfile(payload);
        }
      }

      if (res.data?.success) {
        setProfileSuccess('Profile updated successfully!');
        setProfileData(res.data.data);
      } else {
        setProfileError(res.data?.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to save profile. Please check your inputs.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── Submit Password Updates ──
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await updatePassword({ currentPassword, newPassword });
      if (res.data?.success) {
        setPasswordSuccess(res.data.data?.message || 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.data?.error || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password. Please check your credentials.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // ── Visibility Toggles Persisted in localStorage ──
  const saveVisibilityPrefs = (overrides = {}) => {
    const prefs = {
      showInSearch,
      acceptApplications,
      profileVisible,
      ...overrides
    };
    localStorage.setItem(`bluecollar_visibility_${user?.id}`, JSON.stringify(prefs));
  };

  const handleAvailableToggle = async (value) => {
    setIsAvailable(value);
    setVisibilitySaving(true);
    try {
      await updateWorkerProfile({ isAvailable: value });
      setVisibilitySuccess('Availability updated successfully.');
    } catch {
      setIsAvailable(!value); // revert state on fail
    } finally {
      setVisibilitySaving(false);
    }
  };

  const handleSearchToggle = (value) => {
    setShowInSearch(value);
    saveVisibilityPrefs({ showInSearch: value });
    setVisibilitySuccess('Search visibility updated.');
  };

  const handleAcceptAppsToggle = (value) => {
    setAcceptApplications(value);
    saveVisibilityPrefs({ acceptApplications: value });
    setVisibilitySuccess('Application setting updated.');
  };

  const handleProfileVisibleToggle = (value) => {
    setProfileVisible(value);
    saveVisibilityPrefs({ profileVisible: value });
    setVisibilitySuccess('Profile visibility updated.');
  };

  // ── Export Client JSON files ──
  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAccount = () => {
    const data = {
      email: accountData?.email || user?.email,
      role: accountData?.role || user?.role,
      memberSince: accountData?.createdAt || user?.createdAt,
      exportedAt: new Date().toISOString()
    };
    downloadJson(data, 'bluecollar-account-data.json');
  };

  const handleExportProfile = () => {
    if (!profileData) return;
    const data = {
      ...profileData,
      exportedAt: new Date().toISOString()
    };
    downloadJson(data, 'bluecollar-profile-data.json');
  };

  // ── Delete Account Placeholder ──
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setDeleteMessage('Account deletion is not yet available. This feature will be enabled in a future update.');
    setTimeout(() => setDeleteMessage(''), 5000);
  };

  // ── Layout Format Utilities ──
  const formatMemberSince = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    if (role === 'WORKER') return 'Worker';
    if (role === 'EMPLOYER') return 'Employer';
    if (role === 'ADMIN') return 'Administrator';
    return role;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (isLoadingAccount) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
          <span className="animate-spin material-symbols-outlined">sync</span>
          Loading settings...
        </div>
      </div>
    );
  }

  const displayUser = accountData || user;

  return (
    <>
      <FormPageLayout
        title="Account Settings"
        subtitle="Manage your professional identity and account security."
        sidebar={
          <div className="flex flex-col gap-6">
            {/* Scroll Spy Navigation */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-level-1">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-3 font-bold uppercase tracking-wider px-2">
                Settings Sections
              </h4>
              <div className="flex flex-col gap-1">
                {SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold text-sm flex items-center gap-2.5 transition-all cursor-pointer text-left border-l-4 ${
                        isActive
                          ? 'bg-primary-container/10 text-primary font-bold border-primary'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 border-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{section.icon}</span>
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1 flex flex-col gap-4">
              <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
                Account Status
              </h4>
              
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary font-bold text-sm">
                  {getRoleLabel(displayUser?.role).charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-body-md text-body-md text-on-surface font-semibold truncate">
                    {displayUser?.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full uppercase">
                    {getRoleLabel(displayUser?.role)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span>Verification Status</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm fill" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Member Since</span>
                  <span className="font-semibold text-on-surface">{formatMemberSince(displayUser?.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Login</span>
                  <span className="font-semibold text-on-surface">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Security Tips Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
              <h4 className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">shield</span>
                Security Tips
              </h4>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#059669] text-base shrink-0 mt-0.5">check_circle</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-semibold text-on-surface">Strong Password:</span> Use a combination of uppercase letters, numbers, and symbols.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#059669] text-base shrink-0 mt-0.5">check_circle</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-semibold text-on-surface">Session Check:</span> Regularly audit your active sessions to ensure account safety.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#059669] text-base shrink-0 mt-0.5">check_circle</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-semibold text-on-surface">Data Control:</span> Download your profile data anytime to see what information is public.
                  </p>
                </div>
              </div>
            </div>

            {/* System Help Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
              <h4 className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">help</span>
                Need Assistance?
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Having trouble with your account settings or profile visibility? Our support team is here to help you.
              </p>
              <a
                href="mailto:support@bluecollar.in"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Contact Support
              </a>
            </div>
          </div>
        }
      >
        {/* Delete Message Toast */}
        {deleteMessage && (
          <div className="bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 rounded-lg p-3.5 font-body-sm text-body-sm flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base">info</span>
            <span>{deleteMessage}</span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <section ref={sectionRefs.account} id="account" className="scroll-mt-24">
          <form onSubmit={handleSaveProfile} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 font-headline-sm text-headline-sm">
                <span className="material-symbols-outlined text-primary">badge</span>
                Basic Information
              </h3>
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="bg-primary-container text-on-primary rounded-saas px-4 py-2 text-sm font-bold hover:bg-surface-tint disabled:opacity-50 cursor-pointer shadow-level-1 hover:shadow-level-2 transition-all"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
            <div className="p-8">
              {profileSuccess && (
                <div className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{profileError}</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Profile Photo Upload Widget */}
                <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden border-4 border-surface-container shadow-md flex items-center justify-center">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-4xl">person</span>
                      )}
                    </div>
                    <label 
                      htmlFor="photo-upload-input"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </label>
                    <input 
                      id="photo-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-center text-[10px] text-on-surface-variant max-w-[120px] font-medium leading-snug">
                    JPG, GIF or PNG. Max 800KB
                  </p>
                </div>

                {/* Profile Fields */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface transition-all bg-surface-container-lowest font-body-md text-body-md"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface transition-all bg-surface-container-lowest font-body-md text-body-md"
                    />
                  </div>

                  {user?.role === 'WORKER' && (
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="bio" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Describe your professional experience and skills..."
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface transition-all resize-none h-24 bg-surface-container-lowest font-body-md text-body-md"
                      />
                    </div>
                  )}

                  {user?.role === 'EMPLOYER' && (
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="companyName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface transition-all bg-surface-container-lowest font-body-md text-body-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Section 2: Security & Password */}
        <section ref={sectionRefs.security} id="security" className="scroll-mt-24">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant flex items-center gap-2 bg-surface-container/30">
              <span className="material-symbols-outlined text-primary">shield</span>
              <h3 className="text-lg font-bold text-on-surface font-headline-sm text-headline-sm">
                Security &amp; Password
              </h3>
            </div>
            
            <div className="p-8">
              {passwordSuccess && (
                <div className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="w-full max-w-xl flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Current Password */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="currentPassword" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-outline-variant bg-surface-container-low focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface font-body-md text-body-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showCurrentPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="newPassword" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-surface-container-lowest font-body-md text-body-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.score ? passwordStrength.color : 'bg-surface-container-high'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-[10px] font-bold uppercase ${LABEL_COLORS[passwordStrength.label] || 'text-on-surface-variant'}`}>
                            {passwordStrength.label}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">Last changed: March 12, 2024</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-surface-container-lowest font-body-md text-body-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-surface-tint transition-colors disabled:opacity-50 cursor-pointer shadow-level-1 hover:shadow-level-2"
                  >
                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Active Sessions UI */}
              <div className="pt-8 border-t border-outline-variant/30 mt-8">
                <h4 className="text-sm font-bold text-on-surface mb-4">Current Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">laptop_mac</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Chrome on Windows</p>
                        <p className="text-[11px] text-on-surface-variant">Austin, TX • Currently active</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full uppercase">
                      Current
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">smartphone</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">iPhone 15 Pro</p>
                        <p className="text-[11px] text-on-surface-variant">Austin, TX • 2 hours ago</p>
                      </div>
                    </div>
                    <button type="button" className="text-xs font-bold text-error hover:underline cursor-pointer">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Profile Visibility */}
        <section ref={sectionRefs.visibility} id="visibility" className="scroll-mt-24">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-8">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 font-headline-sm text-headline-sm">
              <span className="material-symbols-outlined text-primary">visibility</span>
              Profile Visibility
            </h3>

            {/* Visibility Success Banner */}
            {visibilitySuccess && (
              <div className="bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{visibilitySuccess}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Worker Specific Toggles */}
              {user?.role === 'WORKER' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Available for Work</p>
                      <p className="text-xs text-on-surface-variant">Show recruiters you are ready for new opportunities</p>
                    </div>
                    <ToggleSwitch
                      id="toggle-available"
                      checked={isAvailable}
                      onChange={handleAvailableToggle}
                      disabled={visibilitySaving}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-outline-variant/30">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Show Profile in Search Results</p>
                      <p className="text-xs text-on-surface-variant">Make your professional profile public to employers</p>
                    </div>
                    <ToggleSwitch
                      id="toggle-search"
                      checked={showInSearch}
                      onChange={handleSearchToggle}
                    />
                  </div>
                </>
              )}

              {/* Employer Specific Toggles */}
              {user?.role === 'EMPLOYER' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Accept Applications</p>
                      <p className="text-xs text-on-surface-variant">Allow workers to submit applications to your job postings</p>
                    </div>
                    <ToggleSwitch
                      id="toggle-accept-apps"
                      checked={acceptApplications}
                      onChange={handleAcceptAppsToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-outline-variant/30">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Profile Visibility</p>
                      <p className="text-xs text-on-surface-variant">Make your employer profile visible to workers browsing the platform</p>
                    </div>
                    <ToggleSwitch
                      id="toggle-profile-visible"
                      checked={profileVisible}
                      onChange={handleProfileVisibleToggle}
                    />
                  </div>
                </>
              )}

              {/* Fallback for Admin */}
              {user?.role === 'ADMIN' && (
                <p className="text-sm text-on-surface-variant italic">
                  No visibility preferences required for Administrator accounts.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Data Management */}
        <section ref={sectionRefs.data} id="data" className="scroll-mt-24">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 p-8">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 font-headline-sm text-headline-sm">
              <span className="material-symbols-outlined text-primary">database</span>
              Data Management
            </h3>
            
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleExportAccount}
                className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Export Account Data
              </button>
              <button
                type="button"
                onClick={handleExportProfile}
                disabled={!profileData}
                className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                Download Profile Data
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Danger Zone */}
        <section ref={sectionRefs.danger} id="danger" className="scroll-mt-24">
          <div className="bg-error-container/10 rounded-xl border-2 border-error/20 p-8">
            <div className="flex items-center gap-2 text-error mb-4">
              <span className="material-symbols-outlined">report_problem</span>
              <h3 className="text-lg font-bold font-headline-sm text-headline-sm">Danger Zone</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-sm font-bold text-on-surface">Delete Account</p>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Once you delete your account, there is no going back. Please be certain. All your history, applications, and certifications will be permanently removed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-error text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </FormPageLayout>

      {/* Confirm Account Deletion Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Your Account?"
        message="This will permanently delete your account, profile, job postings, and all application history. This action is irreversible. Are you sure you want to proceed?"
        confirmLabel="Delete My Account"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

export default SettingsPage;
