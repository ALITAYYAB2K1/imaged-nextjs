"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { Unauthenticated, Authenticated } from "convex/react";
import { LayoutDashboard } from "lucide-react";

function Header() {
  const path = usePathname();
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  if (path.includes("/editor")) return null; // header hidden in editor
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-nowrap">
      <div
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full
       px-8 py-3 flex items-center justify-between gap-8"
      >
        <Link href="/" className="mr-10 md:mar-20">
          <Image
            src="/logo.png"
            alt="Logo"
            className="min-w-24 object-cover hover:offset-y-2 hover:scale-125"
            width={90}
            height={24}
          />
        </Link>
        {path === "/" && (
          <div className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400
                cursor-pointer hover:offset-y-2 hover:scale-125"
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400
                cursor-pointer hover:offset-y-2 hover:scale-125"
            >
              Contact
            </Link>
            <Link
              href="#pricing"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400
                cursor-pointer hover:offset-y-2 hover:scale-125"
            >
              Pricing
            </Link>
          </div>
        )}
        <div
          className="text-white font-medium transition-all duration-300 hover:text-cyan-400
                cursor-pointer  flex items-center gap-3 ml-10 md:ml-20"
        >
          <Unauthenticated>
            <SignInButton>
              <Button variant="glass">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="primary">Sign Up</Button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
            <Link href="/dashboard">
              <Button variant="glass" className="hidden sm:flex">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:flex">Dashboard</span>
              </Button>
            </Link>
            <UserButton />
          </Authenticated>
        </div>
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width={"94%"} color="#06b6d4" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
