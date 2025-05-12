import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white/95 dark:bg-black/95 supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-black/90 sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 backdrop-blur shadow-sm">
      <div className="container mx-auto max-w-screen-xl flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg">
                S
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-black dark:text-white">
              Sabar App
            </p>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              Fitur
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              Tentang
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-md hover:shadow-lg transition-all duration-200">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
