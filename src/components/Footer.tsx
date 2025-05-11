import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t py-4 sm:py-6 md:py-8">
    <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
        &copy; {new Date().getFullYear()} Procurement App. All rights reserved.
      </p>
    </div>
  </footer>
  )
}

export default Footer