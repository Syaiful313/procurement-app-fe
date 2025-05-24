import Link from "next/link";
import { Button } from "./ui/button";
import { Package } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur shadow-sm">
      <div className="container mx-auto max-w-screen-xl flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md sm:h-10 sm:w-10">
              <Package className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <p className="text-xl md:text-2xl font-bold">
              Sabar App
            </p>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Fitur
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Tentang
            </Button>
          </Link>
          <Link href="/login">
            <Button className="shadow-md hover:shadow-lg transition-all duration-200">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;