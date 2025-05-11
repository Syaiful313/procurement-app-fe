import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 md:py-20 lg:py-28">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                  Procurement & Damage Reporting
                </h1>
                <p className="mx-auto max-w-full text-sm text-gray-500 sm:max-w-[550px] sm:text-base md:max-w-[700px] md:text-lg dark:text-gray-400">
                  Sistem internal untuk pengadaan barang dan pelaporan kerusakan
                </p>
              </div>
              <div className="mt-4 sm:mt-6">
                <Link href="/login">
                  <Button className="w-full sm:w-auto">Masuk ke Sistem</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
