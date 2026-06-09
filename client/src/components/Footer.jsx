
function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">build_circle</span>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">BlueCollar</span>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center md:text-right">
          &copy; {new Date().getFullYear()} BlueCollar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
