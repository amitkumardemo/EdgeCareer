import React, { useState } from "react";
import { Button } from "./ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import ThemSwitch from "./theme-switch";

import { FaBars, FaTimes } from "react-icons/fa";

export default async function Header() {
  await checkUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src={"/skill.png"}
            alt="EdgeCareer Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                {BUTTONS_MENUS.DASHBOARD_INSIGHTS}
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">{BUTTONS_MENUS.GROWTH_TOOLS}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {BUTTONS_MENUS.BUILD_RESUME}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-cover-letter" className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" />
                    {BUTTONS_MENUS.COVER_LETTER}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {BUTTONS_MENUS.INTERVIEW_PREP}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">{BUTTONS_MENUS.SIGN_IN}</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
          <ThemSwitch />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-background border-t border-gray-200 shadow-md transition-all ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col p-4 space-y-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {BUTTONS_MENUS.DASHBOARD_INSIGHTS}
              </Button>
            </Link>

            {/* Mobile Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full flex items-center justify-between">
                  <span>{BUTTONS_MENUS.GROWTH_TOOLS}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full">
                <DropdownMenuItem asChild>
                  <Link href="/resume">{BUTTONS_MENUS.BUILD_RESUME}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-cover-letter">{BUTTONS_MENUS.COVER_LETTER}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview">{BUTTONS_MENUS.INTERVIEW_PREP}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="w-full">
                {BUTTONS_MENUS.SIGN_IN}
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

