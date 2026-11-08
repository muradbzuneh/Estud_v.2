"use client";

import React from "react";
import { MapPin, X, Navigation, ExternalLink } from "lucide-react";

export interface CampusHub {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  gate: string;
  lat: number;
  lng: number;
}

export const CAMPUS_HUBS: CampusHub[] = [
  {
    id: "aau-4kilo",
    name: "Addis Ababa University - 4 Kilo",
    shortCode: "AAU 4 Kilo",
    city: "Addis Ababa",
    gate: "Main Gate & Science Library",
    lat: 9.0354,
    lng: 38.7615,
  },
  {
    id: "aau-5kilo",
    name: "Addis Ababa University - AAiT",
    shortCode: "AAU AAiT",
    city: "Addis Ababa",
    gate: "Main Technology Gate",
    lat: 9.0438,
    lng: 38.7611,
  },
  {
    id: "aau-6kilo",
    name: "Addis Ababa University - 6 Kilo",
    shortCode: "AAU 6 Kilo",
    city: "Addis Ababa",
    gate: "Main Campus Gate",
    lat: 9.0478,
    lng: 38.7601,
  },
  {
    id: "aau-tikur",
    name: "Addis Ababa University - Medical School",
    shortCode: "AAU Medical",
    city: "Addis Ababa",
    gate: "Tikur Anbessa Hospital Gate",
    lat: 9.0195,
    lng: 38.7512,
  },
  {
    id: "astu",
    name: "Adama Science and Technology University",
    shortCode: "ASTU Adama",
    city: "Adama, Oromia",
    gate: "ASTU Main Gate Security Post",
    lat: 8.5562,
    lng: 39.2903,
  },
  {
    id: "hu",
    name: "Hawassa University - Main Campus",
    shortCode: "Hawassa University",
    city: "Hawassa, Sidama",
    gate: "Main Campus Agriculture Gate",
    lat: 7.0518,
    lng: 38.4877,
  },
  {
    id: "ju",
    name: "Jimma University - JiT Institute",
    shortCode: "Jimma University",
    city: "Jimma, Oromia",
    gate: "JiT Engineering Main Gate",
    lat: 7.6766,
    lng: 36.8344,
  },
  {
    id: "mu",
    name: "Mekelle University - Main Campus",
    shortCode: "Mekelle University",
    city: "Mekelle, Tigray",
    gate: "Main Campus Gate",
    lat: 13.4872,
    lng: 39.4678,
  },
  {
    id: "bdu",
    name: "Bahir Dar University - Poly Campus",
    shortCode: "Bahir Dar University",
    city: "Bahir Dar, Amhara",
    gate: "Poly Engineering Gate 2",
    lat: 11.5975,
    lng: 37.3912,
  },
];

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCampusId?: string;
}

export function CampusMapModal({
  isOpen,
  onClose,
  initialCampusId,
}: CampusMapModalProps) {
  if (!isOpen) return null;

  const rawLocation = (initialCampusId || "").trim();

  // Find matching hub by code, name or city, otherwise fallback to custom address search
  const hubMatch = rawLocation
    ? CAMPUS_HUBS.find((h) => {
        const query = rawLocation.toLowerCase();
        return (
          h.id.toLowerCase() === query ||
          h.shortCode.toLowerCase().includes(query) ||
          query.includes(h.shortCode.toLowerCase()) ||
          h.name.toLowerCase().includes(query) ||
          query.includes(h.name.toLowerCase()) ||
          h.city.toLowerCase().includes(query) ||
          query.includes(h.city.toLowerCase())
        );
      })
    : CAMPUS_HUBS[0];

  const displayName = hubMatch?.name || rawLocation || "Campus Location";
  const displayAddress = hubMatch
    ? `${hubMatch.gate}, ${hubMatch.city}`
    : rawLocation;

  const embedUrl = hubMatch
    ? `https://maps.google.com/maps?q=${hubMatch.lat},${hubMatch.lng}&hl=en&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(rawLocation + ", Ethiopia")}&hl=en&z=15&output=embed`;

  const navigateUrl = hubMatch
    ? `https://www.google.com/maps/dir/?api=1&destination=${hubMatch.lat},${hubMatch.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawLocation + ", Ethiopia")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-twilight-850 border border-slate-200 dark:border-twilight-700 shadow-2xl flex flex-col text-slate-900 dark:text-white">
        
        {/* Sleek Minimal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-twilight-700 bg-slate-50/80 dark:bg-twilight-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {displayName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-twilight-300 mt-0.5">
                {displayAddress}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-700 transition cursor-pointer"
            aria-label="Close map"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Full-bleed Google Map focused exclusively on this address */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100 dark:bg-twilight-900">
          <iframe
            title={`Map of ${displayName}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-twilight-700 bg-slate-50/80 dark:bg-twilight-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-twilight-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Product pickup location</span>
          </div>

          <a
            href={navigateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8738] via-[#FE9901] to-[#FFA05F] hover:from-[#FE9901] hover:to-[#FF8738] px-4 py-2 text-xs font-bold text-[#07152B] shadow-sm hover:shadow transition"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Navigate in Google Maps</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}
