import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
            <p className="md:text-2xl font-bold font-sans text-base">
              Procurement App
            </p>
        </div>
        <nav className="flex items-center space-x-2">
          <Link href="/login">
            <Button variant="outline" size="lg" className="md:text-md text-sm">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
