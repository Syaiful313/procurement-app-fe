const Footer = () => {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Sabar App. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm transition-colors"
            >
              Tentang Kami
            </a>
            <a
              href="#"
              className="text-sm transition-colors"
            >
              Kontak
            </a>
            <a
              href="#"
              className="text-sm transition-colors"
            >
              Bantuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;