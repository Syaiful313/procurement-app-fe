import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-black dark:text-white">
                  Sistem Pengadaan Barang
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                  Solusi terpadu untuk mengelola proses pengadaan barang secara
                  efisien dan transparan
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="min-w-[200px] bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Masuk ke Sistem
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12 md:text-3xl text-black dark:text-white">
              Fitur Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white dark:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Proses Cepat
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Percepat proses pengadaan dengan sistem yang terintegrasi
                </p>
              </div>
              <div className="text-center space-y-4 p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white dark:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Transparan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pantau status pengadaan secara real-time
                </p>
              </div>
              <div className="text-center space-y-4 p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white dark:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Terkontrol
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kelola anggaran dan approval dengan mudah
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
