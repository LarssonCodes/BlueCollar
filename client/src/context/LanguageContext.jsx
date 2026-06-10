import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    common: {
      backToHome: "Back to Home"
    },
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
      dedicatedPortal: "The #1 network for skilled trades",
      heroTitle: "Connecting Skilled Workers With Great Opportunities",
      heroSubtitle: "Find local jobs or hire trusted workers for gigs and contract work across India. Join a growing community of professionals building their careers.",
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
      title: "Welcome to BlueCollar",
      subtitle: "Log in to manage your professional journey.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitButton: "Sign In",
      loggingIn: "Signing In...",
      noAccount: "Don't have an account?",
      registerNow: "Register",
      forgotPassword: "Forgot Password?",
      keepSignedIn: "Keep me signed in",
      orContinueWith: "Or continue with",
      workerSignUp: "Worker Sign Up",
      employerSignUp: "Employer Sign Up",
      errorFailed: "Login failed. Please check your credentials."
    },
    register: {
      title: "Create an account",
      subtitle: "Join the network of skilled professionals and top employers.",
      roleLabel: "I am joining as a:",
      workerCard: "Worker",
      employerCard: "Employer",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      submitButton: "Create Account",
      submitting: "Creating Account...",
      haveAccount: "Already have an account?",
      loginNow: "Log in",
      brandTitle: "Build your career.\nHire the best.",
      brandSubtitle: "The premier platform connecting skilled tradespeople with top-tier industrial and construction employers.",
      professionalsJoined: "Professionals joined this week",
      workerDesc: "I want to find jobs and manage my career.",
      employerDesc: "I want to post jobs and hire talent.",
      passwordLengthHint: "Must be at least 8 characters long.",
      termsLabel: "I agree to the {terms} and {privacy}",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      errorSelectRole: "Please select an account type",
      errorPasswordLength: "Password must be at least 8 characters long",
      errorTerms: "You must agree to the Terms of Service and Privacy Policy",
      errorFailed: "Registration failed. Please try again."
    }
  },
  hi: {
    common: {
      backToHome: "मुख्य पृष्ठ पर वापस जाएं"
    },
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
      dedicatedPortal: "कुशल व्यवसायों के लिए #1 नेटवर्क",
      heroTitle: "कुशल श्रमिकों को बेहतरीन अवसरों से जोड़ना",
      heroSubtitle: "पूरे भारत में गिग्स और अनुबंध कार्यों के लिए स्थानीय नौकरियां ढूंढें या विश्वसनीय श्रमिकों को नियुक्त करें। अपने करियर का निर्माण करने वाले पेशेवरों के बढ़ते समुदाय में शामिल हों।",
      findJobsBtn: "नौकरी खोजें",
      postJobBtn: "काम पोस्ट करें",
      whyChoose: "ब्लूकॉलर क्यों चुनें?",
      feature1Title: "स्थानीय नौकरियां खोजें",
      feature1Desc: "अपने विशिष्ट ट्रेड और स्थानीय पिनकोड द्वारा आसानी से काम फ़िल्टर करें। अपनी डिजिटल प्रोफ़ाइल के साथ सीधे आवेदन करें।",
      feature2Title: "कुशल कामगार रखें",
      feature2Desc: "स्थानीय इलेक्ट्रीशियन, विभाग और निर्माण पेशेवरों के सत्यापित प्रोफाइल की समीक्षा करें।",
      feature3Title: "तेज़ भर्ती प्रक्रिया",
      feature3Desc: "संपर्क जानकारी अनलॉक करने के लिए उम्मीदवारों को शॉर्टलिस्ट करें। काम को अंतिम रूप देने के लिए सीधे फोन या संदेश भेजें।",
      statWorkers: "कुशल कामगार",
      statGigs: "पूरे किए गए काम",
      statSuccess: "भर्ती सफलता"
    },
    login: {
      title: "ब्लूकॉलर में आपका स्वागत है",
      subtitle: "अपने पेशेवर सफर को प्रबंधित करने के लिए लॉग इन करें।",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      submitButton: "साइन इन करें",
      loggingIn: "साइन इन किया जा रहा है...",
      noAccount: "खाता नहीं है?",
      registerNow: "रजिस्टर करें",
      forgotPassword: "पासवर्ड भूल गए?",
      keepSignedIn: "मुझे साइन इन रखें",
      orContinueWith: "या इसके साथ जारी रखें",
      workerSignUp: "कामगार साइन अप",
      employerSignUp: "नियोक्ता साइन अप",
      errorFailed: "लॉगिन विफल रहा। कृपया अपनी क्रेडेंशियल जांचें।"
    },
    register: {
      title: "खाता बनाएं",
      subtitle: "कुशल पेशेवरों और शीर्ष नियोक्ताओं के नेटवर्क में शामिल हों।",
      roleLabel: "मैं इस रूप में शामिल हो रहा हूँ:",
      workerCard: "कामगार",
      employerCard: "नियोक्ता",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "न्यूनतम 8 वर्ण",
      submitButton: "खाता बनाएं",
      submitting: "खाता बनाया जा रहा है...",
      haveAccount: "पहले से ही एक खाता है?",
      loginNow: "लॉगिन",
      brandTitle: "अपना करियर बनाएं।\nसर्वश्रेष्ठ को नियुक्त करें।",
      brandSubtitle: "कुशल कारीगरों को शीर्ष स्तर के औद्योगिक और निर्माण नियोक्ताओं से जोड़ने वाला प्रमुख मंच।",
      professionalsJoined: "इस सप्ताह शामिल हुए पेशेवर",
      workerDesc: "मैं नौकरियां खोजना और अपना करियर प्रबंधित करना चाहता हूं।",
      employerDesc: "मैं काम पोस्ट करना और प्रतिभाओं को काम पर रखना चाहता हूं।",
      passwordLengthHint: "कम से कम 8 वर्ण लंबा होना चाहिए।",
      termsLabel: "मैं {terms} और {privacy} से सहमत हूँ",
      terms: "सेवा की शर्तों",
      privacy: "गोपनीयता नीति",
      errorSelectRole: "कृपया एक खाता प्रकार चुनें",
      errorPasswordLength: "पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए",
      errorTerms: "आपको सेवा की शर्तों और गोपनीयता नीति से सहमत होना होगा",
      errorFailed: "पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।"
    }
  },
  mz: {
    common: {
      backToHome: "Home lama letna"
    },
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
      dedicatedPortal: "Kuthnathawktu thiam bik te tana network hmahruaitu #1",
      heroTitle: "Kuthnathawktute Hna Tha Nen Inzawmna",
      heroSubtitle: "India ram chhung hmun hrang hranga contract emaw tualchhung hna zawnna leh hnathawktu rin tlak lakluhna. Mahni career enkawl thiam te nen inzawm rawh.",
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
      title: "BlueCollar-ah hian lo lawm i ni",
      subtitle: "I hnathawh kawng enkawl turin lut rawh.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitButton: "Luhna",
      loggingIn: "Luh mek a ni...",
      noAccount: "Account i nei lo em ni?",
      registerNow: "Inregistra rawh",
      forgotPassword: "Password i hre tawh lo em ni?",
      keepSignedIn: "Min hre reng rawh",
      orContinueWith: "Emaw heti hian chhunzawm rawh",
      workerSignUp: "Hnathawktu Inziahluhna",
      employerSignUp: "Chhawrtu Inziahluhna",
      errorFailed: "Luh a hlawhtling lo. I credentials te endik leh rawh."
    },
    register: {
      title: "Account siamna",
      subtitle: "Kuthnathawktu thiam te leh chhawrtu lian te nen inzawm rawh.",
      roleLabel: "Hemi atan hian inziahluh ka duh:",
      workerCard: "Hnathawktu",
      employerCard: "Chhawrtu",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "A tlem berah character 8",
      submitButton: "Account Siamna",
      submitting: "Account siam mek a ni...",
      haveAccount: "Account i nei tawh em?",
      loginNow: "Luhna",
      brandTitle: "I career siam rawh.\nA tha ber chhawr rawh.",
      brandSubtitle: "Kuthnathawktute leh industrial leh in saknaa chhawrtu tha berte inzawmna platform hmahruaitu.",
      professionalsJoined: "Thiam bik nei tunkara rawn inpeih tharte",
      workerDesc: "Hna zawn leh ka career enkawl ka duh.",
      employerDesc: "Hna dah leh mi thiam lakluh ka duh.",
      passwordLengthHint: "A tlem berah character 8 a ni tur a ni.",
      termsLabel: "{terms} leh {privacy} te hi ka pawm e",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      errorSelectRole: "Khawngaihin i nihna tur thlang rawh",
      errorPasswordLength: "Password hi character 8 aia tlem lo a ni tur a ni",
      errorTerms: "Terms of Service leh Privacy Policy hi i pawm a ngai a ni",
      errorFailed: "Inziahluh a hlawhtling lo. Khawngaihin han tum leh rawh."
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
