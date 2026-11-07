"use client";

import React, { useState } from "react";
import {
  MapPin,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  Share2,
} from "lucide-react";

export interface CampusHub {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  gate: string;
  lat: number;
  lng: number;
  repName: string;
  repPhone: string;
  hours: string;
  features: string[];
}

export const CAMPUS_HUBS: CampusHub[] = [
  {
    id: "aau-4kilo",
    name: "Addis Ababa University - 4 Kilo (Science Campus)",
    shortCode: "AAU 4 Kilo",
    city: "Addis Ababa",
    gate: "Gate 1 (Main Entrance) & Science Library Ground Floor",
    lat: 9.0354,
    lng: 38.7615,
    repName: "Abebe Kebede (Lead Hub Rep)",
    repPhone: "+251 911 234 567",
    hours: "Mon - Sat: 8:00 AM - 6:00 PM",
    features: ["Safe Inspection Desk", "Device Charging Station", "ID Verification Desk"],
  },
  {
    id: "aau-5kilo",
    name: "Addis Ababa University - 5 Kilo (AAiT Engineering)",
    shortCode: "AAU AAiT",
    city: "Addis Ababa",
    gate: "Main Technology Gate & Innovation Center Student Lounge",
    lat: 9.0438,
    lng: 38.7611,
    repName: "Selamawit Tadesse (AAiT Rep)",
    repPhone: "+251 922 345 678",
    hours: "Mon - Sat: 8:00 AM - 6:30 PM",
    features: ["Hardware Testing Tools", "Wi-Fi Hub", "Secure Handover Locker"],
  },
  {
    id: "aau-6kilo",
    name: "Addis Ababa University - 6 Kilo (Main / Social)",
    shortCode: "AAU 6 Kilo",
    city: "Addis Ababa",
    gate: "Ras Mekonnen Hall Plaza & Main Gate Kiosk",
    lat: 9.0478,
    lng: 38.7601,
    repName: "Biniam Girma (Social Campus Rep)",
    repPhone: "+251 933 456 789",
    hours: "Mon - Sat: 8:00 AM - 6:00 PM",
    features: ["Textbook Exchange Counter", "Student Union Desk"],
  },
  {
    id: "aau-tikur",
    name: "Addis Ababa University - Tikur Anbessa (Medical)",
    shortCode: "AAU Medical",
    city: "Addis Ababa",
    gate: "Medical School Gate & Student Association Hub",
    lat: 9.0195,
    lng: 38.7512,
    repName: "Dr. Hiwot Bekele (Campus Rep)",
    repPhone: "+251 944 567 890",
    hours: "Mon - Sun: 8:00 AM - 7:00 PM",
    features: ["Medical Gear Inspection", "24h Secure Box"],
  },
  {
    id: "astu",
    name: "Adama Science and Technology University (ASTU)",
    shortCode: "ASTU Adama",
    city: "Adama, Oromia",
    gate: "ASTU Main Gate Security Post & Central Student Center",
    lat: 8.5562,
    lng: 39.2903,
    repName: "Kidus Assefa (ASTU Rep)",
    repPhone: "+251 955 678 901",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    features: ["Regional Escrow Hub", "Runner Dispatch Base"],
  },
  {
    id: "hu",
    name: "Hawassa University - Main Campus",
    shortCode: "HU Hawassa",
    city: "Hawassa, Sidama",
    gate: "Agriculture Gate & Student Union Handover Kiosk",
    lat: 7.0518,
    lng: 38.4877,
    repName: "Yohannes Haile (HU Rep)",
    repPhone: "+251 966 789 012",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    features: ["Campus Runner Drop-off", "Verified ID Check"],
  },
  {
    id: "ju",
    name: "Jimma University - Technology Institute (JiT)",
    shortCode: "JU Jimma",
    city: "Jimma, Oromia",
    gate: "JiT Engineering Gate & Main Student Cafe Plaza",
    lat: 7.6766,
    lng: 36.8344,
    repName: "Tariku Desta (JU Rep)",
    repPhone: "+251 977 890 123",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    features: ["Electronics Safe Zone", "Escrow Cashless Desk"],
  },
  {
    id: "mu",
    name: "Mekelle University - Arid Campus",
    shortCode: "MU Mekelle",
    city: "Mekelle, Tigray",
    gate: "Main Campus Gate & Student Association Office",
    lat: 13.4872,
    lng: 39.4678,
    repName: "Haftom Girmay (MU Rep)",
    repPhone: "+251 988 901 234",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    features: ["SafeTrade Handover Station", "Inspection Room"],
  },
  {
    id: "bdu",
    name: "Bahir Dar University - Poly Campus",
    shortCode: "BDU Bahir Dar",
    city: "Bahir Dar, Amhara",
    gate: "Poly Engineering Campus Gate 2 & Student Lounge",
    lat: 11.5975,
    lng: 37.3912,
    repName: "Mesfin Alemu (BDU Rep)",
    repPhone: "+251 999 012 345",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    features: ["Engineering Tool Desk", "Safe Escrow Verification"],
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
  const [selectedHub, setSelectedHub] = useState<CampusHub>(() => {
    if (initialCampusId) {
      const match = CAMPUS_HUBS.find(
        (h) =>
          h.id === initialCampusId ||
          h.shortCode.toLowerCase().includes(initialCampusId.toLowerCase()) ||
          h.name.toLowerCase().includes(initialCampusId.toLowerCase())
      );
      if (match) return match;
    }
    return CAMPUS_HUBS[0];
  });

  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const googleMapsUrl = `https://maps.google.com/maps?q=${selectedHub.lat},${selectedHub.lng}&hl=en&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedHub.lat},${selectedHub.lng}`;

  const copyPhone = () => {
    navigator.clipboard.writeText(selectedHub.repPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-twilight-800 border border-slate-200 dark:border-twilight-700 shadow-2xl flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-twilight-700 bg-slate-50/70 dark:bg-twilight-750/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Campus SafeTrade Hubs & Live Map
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live GPS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-twilight-300">
                Designated campus gates for safe item inspection, PIN verification & cash-free handover
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content: 2-column layout (Hubs list & Google Map) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Campus Hub Selector */}
          <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-twilight-700 space-y-3 overflow-y-auto max-h-[300px] md:max-h-[520px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-twilight-400 px-1">
              Select University Campus ({CAMPUS_HUBS.length} Verified Hubs)
            </div>

            <div className="space-y-1.5">
              {CAMPUS_HUBS.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/70 dark:bg-twilight-750 shadow-xs"
                        : "border-slate-200/70 dark:border-twilight-700 hover:border-slate-300 dark:hover:border-twilight-600 bg-slate-50/30 dark:bg-twilight-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold ${
                              isSelected
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {hub.shortCode}
                          </span>
                          <span className="text-[10px] text-slate-400">&bull; {hub.city}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-twilight-300 line-clamp-1 mt-0.5 font-normal">
                          {hub.gate}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Google Map Embed & Active Hub Detail */}
          <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            {/* Embedded Google Map */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-twilight-700 shadow-sm bg-slate-100 dark:bg-twilight-900">
              <iframe
                title={`Google Map - ${selectedHub.name}`}
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-twilight-900/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 shadow-md border border-slate-200 dark:border-twilight-700 hover:scale-105 transition"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Navigate</span>
              </a>
            </div>

            {/* Active Hub Card Info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-twilight-750 border border-slate-200/80 dark:border-twilight-700 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedHub.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-twilight-300 mt-1">
                  <Building2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>
                    <strong>Designated Meeting Point:</strong> {selectedHub.gate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-twilight-700">
                <div className="flex items-center gap-2 text-slate-600 dark:text-twilight-300">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedHub.hours}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-slate-600 dark:text-twilight-300">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium truncate">{selectedHub.repPhone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyPhone}
                    className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    {copiedPhone ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Hub Features Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedHub.features.map((feat) => (
                  <span
                    key={feat}
                    className="rounded-lg bg-white dark:bg-twilight-800 border border-slate-200/80 dark:border-twilight-700 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-twilight-300 shadow-2xs"
                  >
                    &bull; {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-twilight-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Protected by Estud 48h Inspection Guarantee</span>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2.5 px-5 text-xs font-semibold text-white shadow-md shadow-brand-600/25 border border-white/10 transition cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
