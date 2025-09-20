import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
     <header className="shadow-md w-full bg-cyan-100">
      <nav className="max-w-6xl mx-auto p-4 flex justify-between items-center">
       
        <div className="text-2xl font-bold text-cyan-900">
          <Link href="/"> welcome to AI pro tool</Link>
        </div>

        {/* Links */}
        <ul className="hidden md:flex space-x-6 text-cyan-800 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/meditation">Meditation</Link>
          </li>
          <li>
            <Link href="/notifications">Notifications</Link>
          </li>
        </ul>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
      
        </div>
      </nav>
     
    </header>
  )
}

export default Navbar
