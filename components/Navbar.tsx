'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, X } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Navigation groups
  const navGroups = [
    {
      title: 'Major Promotions',
      links: [
        { href: '/ufc', label: 'UFC' },
        { href: '/bellator', label: 'Bellator' },
        { href: '/one-championship', label: 'ONE Championship' },
        { href: '/all-videos', label: 'All Videos' },
      ]
    },
    {
      title: 'International MMA',
      links: [
        { href: '/cage-warriors', label: 'Cage Warriors' },
        { href: '/fury-fc', label: 'Fury FC' },
        { href: '/boxing', label: 'Boxing' },
        { href: '/pfl', label: 'PFL' },

      ]
    }
  ];

  // Click outside listener for more menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current && 
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when it becomes visible
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  const mainNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/ufc', label: 'UFC' },
    { href: '/fight-simulator-ai/', label: 'UFC Fight Simulator' },
    { href: '/ufc-wallpaper', label: 'Wallpaper' },
    { href: '/ufc-fighters', label: 'UFC Fighters' },
    { href: '/one-championship', label: 'ONE Championship' },
    { href: '/all-videos', label: 'All Videos' },
  ];

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    // Reset more menu state when mobile menu is toggled
    setShowMoreMenu(false);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
    
    <header 
      className={`fixed top-0 z-50 w-full ${
        isScrolled ? 'bg-[#141414] backdrop-blur-md' : 'bg-transparent'
      } transition-colors duration-300`}
    >
       <div className="w-full bg-[#E50914] text-white text-center text-sm py-2 px-4 font-medium">
        This website is for sell, please contact at <a href="mailto:mularenatiket@gmail.com" className="underline">mularenatiket@gmail.com</a>
      </div>
      {/* Desktop Navigation */}
      <div className="flex items-center justify-between px-4 py-4 md:px-12">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-[#E50914] rounded-full"
            onClick={toggleMobileMenu}
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <Link href="/">
          <h1 className="text-2xl font-bold text-[#E50914]">
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </h1>

          </Link>
          
          {/* Desktop Main Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-white hover:text-[#E50914] transition-colors rounded-full px-4 ${
                    pathname === link.href ? 'bg-[#E50914]/10' : ''
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {/* Desktop More Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white hover:text-[#E50914] transition-colors rounded-full px-4 flex items-center gap-1"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                More <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showMoreMenu && (
                <div 
                  ref={moreMenuRef}
                  className="absolute top-full left-0 mt-2 w-[400px] bg-[#1E1E1E] rounded-lg shadow-lg border border-white/10 p-4 z-50"
                >
                  {navGroups.map((group) => (
                    <div key={group.title} className="mb-4">
                      <h3 className="text-[#E50914] font-bold mb-2 border-b border-white/10 pb-1">
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {group.links.map((link) => (
                          <Link key={link.href} href={link.href}>
                            <Button
                              variant="ghost"
                              className={`w-full text-left text-white hover:text-[#E50914] transition-colors ${
                                pathname === link.href ? 'bg-[#E50914]/10' : ''
                              }`}
                              onClick={() => setShowMoreMenu(false)}
                            >
                              {link.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Desktop Icons */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-[#E50914] rounded-full"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-[#E50914] rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#141414] absolute top-full left-0 w-full">
          <div className="flex flex-col">
            {/* Main Mobile Links */}
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full text-left text-white hover:text-[#E50914] transition-colors py-3 ${
                    pathname === link.href ? 'bg-[#E50914]/10' : ''
                  }`}
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            {/* Mobile More Menu */}
            <div>
              <Button
                variant="ghost"
                className={`w-full text-left text-white hover:text-[#E50914] transition-colors py-3 flex items-center justify-between ${
                  showMoreMenu ? 'bg-[#E50914]/10' : ''
                }`}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                More <ChevronDown className={`h-4 w-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </Button>

              {showMoreMenu && (
                <div className="bg-[#1A1A1A] p-4">
                  {navGroups.map((group) => (
                    <div key={group.title} className="mb-4">
                      <h3 className="text-[#E50914] font-bold mb-2 border-b border-white/10 pb-1">
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {group.links.map((link) => (
                          <Link key={link.href} href={link.href}>
                            <Button
                              variant="ghost"
                              className={`w-full text-left text-white hover:text-[#E50914] transition-colors ${
                                pathname === link.href ? 'bg-[#E50914]/10' : ''
                              }`}
                              onClick={toggleMobileMenu}
                            >
                              {link.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {/* Search Overlay */}
{showSearch && (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-xl relative">
      {/* Close Button Positioned Outside */}
      <Button
        type="button"
        variant="ghost"
        className="absolute -top-12 right-0 text-white hover:text-[#E50914]"
        onClick={() => setShowSearch(false)}
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="w-full p-4 text-2xl bg-[#1E1E1E] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]"
        />
        <Button
          type="submit"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-[#E50914]"
        >
          <Search className="h-6 w-6" />
        </Button>
      </form>
    </div>
  </div>
)}
    </header>
    </>
  );
}