import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    nav: {
      findJobs: "Find Jobs",
      postJobs: "Post Jobs",
      about: "About",
      login: "Login",
      signUp: "Sign Up",
      profile: "Profile",
      logout: "Logout",
      themeMode: "Theme Mode",
      loggedInAs: "Logged in as",
      toggleTheme: "Toggle Theme"
    },
    landing: {
      dedicatedPortal: "India's Dedicated Blue-Collar Job Portal",
      heroTitle: "Connecting Skilled Workers with Local Gigs & Contract Jobs",
      heroSubtitle: "Find trusted local jobs or hire skilled professionals in minutes. Electricians, plumbers, welders, drivers, mechanics, and construction workers are all ready for local contracts.",
      findJobsBtn: "Find Jobs",
      postJobBtn: "Post a Job",
      whyChoose: "Why Choose BlueCollar?",
      feature1Title: "Find Local Jobs",
      feature1Desc: "Filter gigs easily by your specific trade and local pincode. Apply directly with your digital profile.",
      feature2Title: "Hire Skilled Workers",
      feature2Desc: "Review verified profiles of local electricians, plumbers, welders, and construction professionals.",
      feature3Title: "Fast Hiring",
      feature3Desc: "Shortlist candidates to unlock contact information. Directly phone or message to finalize work.",
      statWorkers: "Skilled Workers",
      statGigs: "Completed Gigs",
      statSuccess: "Hiring Success"
    },
    login: {
      title: "Login to BlueCollar",
      subtitle: "Enter your credentials to access your dashboard.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitButton: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      registerNow: "Register"
    },
    register: {
      title: "Create an Account",
      subtitle: "Select your role to get started on BlueCollar.",
      roleLabel: "I want to register as a:",
      workerCard: "Worker",
      employerCard: "Employer",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      submitButton: "Register",
      submitting: "Creating Account...",
      haveAccount: "Already have an account?",
      loginNow: "Login"
    }
  },
  hi: {
    nav: {
      findJobs: "नौकरी खोजें",
      postJobs: "काम पोस्ट करें",
      about: "हमारे बारे में",
      login: "लॉगिन",
      signUp: "साइन अप",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      themeMode: "थीम मोड",
      loggedInAs: "लॉग इन किया है:",
      toggleTheme: "थीम बदलें"
    },
    landing: {
      dedicatedPortal: "भारत का समर्पित ब्लूकॉलर जॉब पोर्टल",
      heroTitle: "कुशल श्रमिकों को स्थानीय काम और अनुबंध नौकरियों से जोड़ना",
      heroSubtitle: "कुछ ही मिनटों में विश्वसनीय स्थानीय नौकरियां खोजें या कुशल पेशेवरों को काम पर रखें। इलेक्ट्रीशियन, प्लंबर, वेल्डर, ड्राइवर, मैकेनिक और निर्माण श्रमिक सभी स्थानीय अनुबंधों के लिए तैयार हैं।",
      findJobsBtn: "नौकरी खोजें",
      postJobBtn: "काम पोस्ट करें",
      whyChoose: "ब्लूकॉलर क्यों चुनें?",
      feature1Title: "स्थानीय नौकरियां खोजें",
      feature1Desc: "अपने विशिष्ट ट्रेड और स्थानीय पिनकोड द्वारा आसानी से काम फ़िल्टर करें। अपनी डिजिटल प्रोफ़ाइल के साथ सीधे आवेदन करें।",
      feature2Title: "कुशल कामगार रखें",
      feature2Desc: "स्थानीय इलेक्ट्रीशियन, प्लंबर, वेल्डर और निर्माण पेशेवरों के सत्यापित प्रोफाइल की समीक्षा करें।",
      feature3Title: "तेज़ भर्ती प्रक्रिया",
      feature3Desc: "संपर्क जानकारी अनलॉक करने के लिए उम्मीदवारों को शॉर्टलिस्ट करें। काम को अंतिम रूप देने के लिए सीधे फोन या संदेश भेजें।",
      statWorkers: "कुशल कामगार",
      statGigs: "पूरे किए गए काम",
      statSuccess: "भर्ती सफलता"
    },
    login: {
      title: "ब्लूकॉलर में लॉगिन करें",
      subtitle: "अपने डैशबोर्ड तक पहुँचने के लिए अपनी क्रेडेंशियल दर्ज करें।",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      submitButton: "लॉगिन करें",
      loggingIn: "लॉगिन किया जा रहा है...",
      noAccount: "खाता नहीं है?",
      registerNow: "रजिस्टर करें"
    },
    register: {
      title: "खाता बनाएं",
      subtitle: "ब्लूकॉलर पर शुरू करने के लिए अपनी भूमिका चुनें।",
      roleLabel: "मैं इस रूप में पंजीकरण करना चाहता हूँ:",
      workerCard: "कामगार",
      employerCard: "नियोक्ता",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "न्यूनतम 8 वर्ण",
      submitButton: "पंजीकरण करें",
      submitting: "खाता बनाया जा रहा है...",
      haveAccount: "पहले से ही एक खाता है?",
      loginNow: "लॉगिन"
    }
  },
  mz: {
    nav: {
      findJobs: "Hna Zawnna",
      postJobs: "Hna Dahna",
      about: "Kan Chanchin",
      login: "Luhna",
      signUp: "Inziahluhna",
      profile: "Profile",
      logout: "Chhuahna",
      themeMode: "Theme Mode",
      loggedInAs: "Hemi angin luh a ni:",
      toggleTheme: "Theme Thlakna"
    },
    landing: {
      dedicatedPortal: "India-a Blue-Collar Hna Zawnna Portal Bik",
      heroTitle: "Kuthnathawktute leh Tualchhung Hnathawh/Contract Inzawmna",
      heroSubtitle: "Tualchhung hna rin tlak zawnna emaw thiam bik nei lakluhna minutes reilotu chhungin. Electrician, plumber, welder, driver, mechanic, leh in sak thiamte tualchhung contract atan an inpeih reng a ni.",
      findJobsBtn: "Hna Zawnna",
      postJobBtn: "Hna Dahna",
      whyChoose: "Engvanga BlueCollar thlang nge i nih?",
      feature1Title: "Tualchhung Hna Zawnna",
      feature1Desc: "I thiamna bik leh tualchhung pincode hmangin hna awlsam takin thliar la. I profile hmangin dil nghal rawh.",
      feature2Title: "Kuthnathawktu Lakluhna",
      feature2Desc: "Tualchhung electrician, plumber, welder, leh in sak thiam verified profile te thlir rawh.",
      feature3Title: "Inla luh chakna",
      feature3Desc: "Candidate-te contact biak theihna hawng turin thlang chhuak la. Hna tihfel nan be tlang nghal rawh.",
      statWorkers: "Kuthnathawktu Thiam te",
      statGigs: "Hnathawh Zawh Tawh te",
      statSuccess: "Hlawhtling taka Lakluhna"
    },
    login: {
      title: "Chibai, lo lut leh rawh",
      subtitle: "Tualchhung hna zawng tur emaw hnathawktu la lut turin lut rawh.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitButton: "Luhna",
      loggingIn: "Luh mek a ni...",
      noAccount: "Account i nei lo em ni?",
      registerNow: "Inregistra rawh"
    },
    register: {
      title: "Account Thar Siamna",
      subtitle: "BlueCollar-a inṭan turin i nihna thlang rawh.",
      roleLabel: "Hemi atan hian inziahluh ka duh:",
      workerCard: "Hnathawktu",
      employerCard: "Chhawrtu",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "A tlem berah character 8",
      submitButton: "Inregistra rawh",
      submitting: "Account siam mek a ni...",
      haveAccount: "Account i nei tawh em?",
      loginNow: "Luhna"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language] || translations['en'];
    
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English if translation missing
        let fallback = translations['en'];
        for (const fallbackKey of keys) {
          if (fallback && fallback[fallbackKey] !== undefined) {
            fallback = fallback[fallbackKey];
          } else {
            return path; // Return key path as final fallback
          }
        }
        return fallback;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
