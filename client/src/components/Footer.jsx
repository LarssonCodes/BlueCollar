import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant py-12 mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">build_circle</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} BlueCollar. All rights reserved.
          </span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          <Link to="/support" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Support & Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
