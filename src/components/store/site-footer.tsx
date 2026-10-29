'use client'

import { Instagram, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1614] text-[#FAF7F2] mt-auto">
      {/* Top accent strip */}
      <div className="h-1 bg-[#8B5A3C]" />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Wordmark + tagline */}
          <div className="col-span-2 md:col-span-5">
            <h2 className="brand-wordmark text-4xl md:text-5xl text-[#FAF7F2] mb-2">
              aangan<span className="period">.</span>
            </h2>
            <p className="font-serif italic text-lg text-[#8B5A3C] mb-4">
              Wear the Courtyard.
            </p>
            <p className="text-xs text-[#C9BBA3] leading-relaxed max-w-xs">
              A minimal-premium everyday apparel brand from Lahore, Pakistan. Built to be re-worn 100+ washes, in earth tones inspired by the Pakistani aangan.
            </p>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 md:col-start-7">
            <h3 className="brand-eyebrow text-[#C9BBA3] mb-3">Shop</h3>
            <ul className="space-y-2 text-xs text-[#FAF7F2]">
              <li><a href="#shop" className="hover:text-[#8B5A3C] transition-colors">All products</a></li>
              <li><a href="#categories" className="hover:text-[#8B5A3C] transition-colors">Categories</a></li>
              <li><a href="#shop" className="hover:text-[#8B5A3C] transition-colors">Hero pieces</a></li>
              <li><a href="#about" className="hover:text-[#8B5A3C] transition-colors">Brand story</a></li>
            </ul>
          </div>

          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="brand-eyebrow text-[#C9BBA3] mb-3">Brand</h3>
            <ul className="space-y-2 text-xs text-[#FAF7F2]">
              <li><a href="#about" className="hover:text-[#8B5A3C] transition-colors">About</a></li>
              <li><a href="#newsletter" className="hover:text-[#8B5A3C] transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-[#8B5A3C] transition-colors">Sizing guide</a></li>
              <li><a href="#" className="hover:text-[#8B5A3C] transition-colors">Care</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-3">
            <h3 className="brand-eyebrow text-[#C9BBA3] mb-3">Contact</h3>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#8B5A3C]" />
                <a href="mailto:hello@aangan.pk" className="hover:text-[#8B5A3C] transition-colors">hello@aangan.pk</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-3.5 w-3.5 text-[#8B5A3C]" />
                <a href="#" className="hover:text-[#8B5A3C] transition-colors">@aangan.pk</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#8B5A3C]" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#3A3128] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[10px] text-[#C9BBA3] uppercase tracking-[0.16em]">
            © {year} AANGAN Brand Studio · All rights reserved
          </p>
          <div className="flex gap-4 text-[10px] text-[#C9BBA3] uppercase tracking-[0.16em]">
            <a href="#" className="hover:text-[#8B5A3C] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#8B5A3C] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#8B5A3C] transition-colors">Shipping</a>
            <a href="#" className="hover:text-[#8B5A3C] transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
