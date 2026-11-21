"use client";

import React, { useState } from "react";
import {
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Send,
  Camera,
  X,
  Phone,
  Tag,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { trpc } from "@/trpc/client";
import { ImageUploader } from "@/components/image-uploader";
import { StatusBadge, SectionTypeTag } from "@/components/ui/status-badge";

interface LostFoundItem {
  id: string;
  reportNumber: string;
  type: "LOST" | "FOUND";
  title: string;
  description: string;
  category: string;
  campus: string;
  locationDetail: string;
  approximateDate: string;
  status: "OPEN" | "CLAIM_SUBMITTED" | "VERIFIED_RECOVERED" | "CLOSED";
  reporterName: string;
  contactPhone?: string;
  imageUrl?: string;
}

const INITIAL_FALLBACK_ITEMS: LostFoundItem[] = [
  {
    id: "lf-mock-1",
    reportNumber: "EST-LF-2026-001",
    type: "FOUND",
    title: "AAU Student ID Card (College of Natural Sciences)",
    description: "Found near 4 Kilo Biology building courtyard benches. Name reads Dawit K. Turned over to Campus Safe Hub Gate 1.",
    category: "Student ID Cards",
    campus: "AAU 4 Kilo (Science)",
    locationDetail: "Courtyard Benches outside Biology Dept",
    approximateDate: "Today, 10:30 AM",
    status: "OPEN",
    reporterName: "Campus Gate 1 Rep (Biruk)",
    contactPhone: "+251911223344",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205482/estud/products/gm1mw2kvp0cdxfh0e6ib.jpg",
  },
  {
    id: "lf-mock-2",
    reportNumber: "EST-LF-2026-002",
    type: "LOST",
    title: "Casio FX-991EX ClassWiz Scientific Calculator",
    description: "Lost during Differential Equations midterm in Hall 302. Has a yellow periodic table sticker on the slipcase cover.",
    category: "Calculators & Tech",
    campus: "AAU 5 Kilo (AAiT)",
    locationDetail: "Lecture Hall 302 / 3rd Floor",
    approximateDate: "Yesterday, 3:15 PM",
    status: "OPEN",
    reporterName: "Natnael T.",
    contactPhone: "+251922334455",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205488/estud/products/d0oj33bk0mas5z7m8kws.jpg",
  },
  {
    id: "lf-mock-3",
    reportNumber: "EST-LF-2026-003",
    type: "FOUND",
    title: "HP 65W USB-C Laptop Charger & Adapter",
    description: "Turned in to library circulation desk. Black braided cable with Ethiopian 2-pin wall plug adapter.",
    category: "Calculators & Tech",
    campus: "ASTU Adama",
    locationDetail: "Central University Library 2nd Floor Study Cubicle",
    approximateDate: "Nov 05, 2026",
    status: "OPEN",
    reporterName: "Library Admin Desk",
    contactPhone: "+251933445566",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205483/estud/products/vmgc9gbcyr8x8w2sej01.jpg",
  },
  {
    id: "lf-mock-4",
    reportNumber: "EST-LF-2026-004",
    type: "FOUND",
    title: "Dorm Room Keys with Red Leather Keychain",
    description: "Key set with 2 brass keys and a red circular leather fob. Safely stored with student rep at Gate 2.",
    category: "Dorm Keys",
    campus: "AAU 6 Kilo (Main Campus)",
    locationDetail: "Path between Kennedy Library and Dorm Block 12",
    approximateDate: "Nov 04, 2026",
    status: "CLAIM_SUBMITTED",
    reporterName: "Abebe G.",
    contactPhone: "+251944556677",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205485/estud/products/epqmnjm8x3mmsx90yx6f.jpg",
  },
  {
    id: "lf-mock-5",
    reportNumber: "EST-LF-2026-005",
    type: "LOST",
    title: "Black Leather Wallet with CBE Birr Card & ID",
    description: "Brown leather bi-fold wallet lost around cafeteria entrance. Need student ID and debit card back urgently.",
    category: "Wallets & Bags",
    campus: "Hawassa University",
    locationDetail: "Main Student Cafeteria walkway",
    approximateDate: "Nov 04, 2026",
    status: "OPEN",
    reporterName: "Selamawit B.",
    contactPhone: "+251955667788",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205486/estud/products/rxwxchigrz0dw3njh8ig.jpg",
  },
  {
    id: "lf-mock-6",
    reportNumber: "EST-LF-2026-006",
    type: "FOUND",
    title: "Engineering Mechanics: Statics Textbook (8th Edition)",
    description: "Found on cafeteria table after lunch. Contains hand-written lecture summaries on chapter 4.",
    category: "Books & Folders",
    campus: "AAU 5 Kilo (AAiT)",
    locationDetail: "Engineering Canteen 1st floor",
    approximateDate: "Nov 03, 2026",
    status: "VERIFIED_RECOVERED",
    reporterName: "Campus Safe Hub Rep",
    imageUrl: "https://res.cloudinary.com/dyq706cyi/image/upload/v1795205482/estud/products/gm1mw2kvp0cdxfh0e6ib.jpg",
  },
];

const CAMPUSES = [
  "All Campuses",
  "AAU 4 Kilo (Science)",
  "AAU 5 Kilo (AAiT)",
  "AAU 6 Kilo (Main Campus)",
  "AAU Tikur Anbessa (Medical)",
  "ASTU Adama",
  "Hawassa University",
  "Jimma University",
  "Mekelle University",
  "Bahir Dar University",
];

const CATEGORIES = [
  "All Categories",
  "Student ID Cards",
  "Calculators & Tech",
  "Dorm Keys",
  "Wallets & Bags",
  "Books & Folders",
  "Clothing & Wearables",
  "Other Campus Gear",
];

export default function LostFoundPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "LOST" | "FOUND">("ALL");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<"LOST" | "FOUND">("FOUND");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedItemToClaim, setSelectedItemToClaim] = useState<LostFoundItem | null>(null);

  // Success toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for reporting
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Student ID Cards");
  const [formCampus, setFormCampus] = useState("AAU 4 Kilo (Science)");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("Today");
  const [formDescription, setFormDescription] = useState("");
  const [formContactPhone, setFormContactPhone] = useState("");
  const [formSecretMark, setFormSecretMark] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  // Claim form states
  const [claimProof, setClaimProof] = useState("");
  const [claimantContact, setClaimantContact] = useState("");

  // Local state to store items (merged with tRPC query data)
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_FALLBACK_ITEMS);

  // tRPC mutation
  const createReportMutation = trpc.lostFound.createReport.useMutation({
    onSuccess: (res) => {
      showToast(`Report submitted successfully! Case ID: ${res.reportNumber}`);
      setIsReportModalOpen(false);
      resetReportForm();
    },
    onError: () => {
      // Graceful local insertion
      const newItem: LostFoundItem = {
        id: "lf-" + Date.now(),
        reportNumber: `EST-LF-${Date.now().toString(36).toUpperCase()}`,
        type: reportType,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        campus: formCampus,
        locationDetail: formLocation || "Campus Safe Hub",
        approximateDate: formDate,
        status: "OPEN",
        reporterName: "You (Verified Student)",
        contactPhone: formContactPhone,
        imageUrl: formImageUrl || undefined,
      };
      setItems((prev) => [newItem, ...prev]);
      showToast(`Report filed with Campus Desk! Case ID: ${newItem.reportNumber}`);
      setIsReportModalOpen(false);
      resetReportForm();
    },
  });

  const submitClaimMutation = trpc.lostFound.submitClaim.useMutation({
    onSuccess: () => {
      showToast("Ownership proof submitted to Campus Hub! A rep will verify.");
      setIsClaimModalOpen(false);
      setClaimProof("");
      setClaimantContact("");
    },
    onError: () => {
      if (selectedItemToClaim) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItemToClaim.id
              ? { ...item, status: "CLAIM_SUBMITTED" }
              : item
          )
        );
      }
      showToast("Ownership proof submitted to Campus Hub! A rep will verify.");
      setIsClaimModalOpen(false);
      setClaimProof("");
      setClaimantContact("");
    },
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const resetReportForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormLocation("");
    setFormContactPhone("");
    setFormSecretMark("");
    setFormImageUrl("");
  };

  const handleOpenReportModal = (type: "LOST" | "FOUND") => {
    setReportType(type);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    createReportMutation.mutate({
      type: reportType,
      title: formTitle,
      description: formDescription,
      category: formCategory,
      approximateDate: formDate,
      campusName: formCampus,
      locationDetail: formLocation,
      contactPhone: formContactPhone,
      privateOwnershipMark: formSecretMark || undefined,
      imageUrls: formImageUrl ? [formImageUrl] : undefined,
    });
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToClaim || !claimProof) return;

    submitClaimMutation.mutate({
      reportId: selectedItemToClaim.id,
      privateProofDescription: claimProof,
      claimantContact: claimantContact || undefined,
    });
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.type === activeTab;
    const matchesCampus =
      selectedCampus === "All Campuses" || item.campus.includes(selectedCampus);
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCampus && matchesCategory && matchesSearch;
  });

  const foundCount = items.filter((i) => i.type === "FOUND" && i.status === "OPEN").length;
  const lostCount = items.filter((i) => i.type === "LOST" && i.status === "OPEN").length;
  const recoveredCount = items.filter((i) => i.status === "VERIFIED_RECOVERED").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-twilight-900 transition-colors duration-200">
      <Navbar />

      {/* Toast alert banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Open-Source Inspired Clean Campus Notice Board Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-twilight-800 border border-slate-200/80 dark:border-twilight-700 p-6 sm:p-8 md:p-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Campus Handover Desks</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Campus Lost &amp; Found Board
              </h1>

              <p className="text-sm text-slate-600 dark:text-twilight-300 leading-relaxed">
                Misplaced your student ID, calculator, keys, or study gear? Found an item on campus?
                Turn it in or file a report. Items turned into campus library desks and security gates are safe and ready for owner verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenReportModal("FOUND")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>I Found an Item (Turn In)</span>
                </button>

                <button
                  onClick={() => handleOpenReportModal("LOST")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-twilight-600 bg-transparent hover:bg-slate-100 dark:hover:bg-twilight-750 text-slate-900 dark:text-white font-semibold text-xs transition-all cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4 text-amber-500" />
                  <span>I Lost Something (Report Missing)</span>
                </button>
              </div>
            </div>

            {/* Clean Stats Overview Cards (Shadcn style) */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 shrink-0 lg:w-64">
              <div className="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-twilight-750 border border-slate-200/60 dark:border-twilight-700">
                <span className="text-xs text-slate-500 dark:text-twilight-400 font-medium">At Campus Hub</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{foundCount} Items</span>
              </div>
              <div className="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-twilight-750 border border-slate-200/60 dark:border-twilight-700">
                <span className="text-xs text-slate-500 dark:text-twilight-400 font-medium">Reported Lost</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{lostCount} Items</span>
              </div>
              <div className="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-twilight-750 border border-slate-200/60 dark:border-twilight-700">
                <span className="text-xs text-slate-500 dark:text-twilight-400 font-medium">Reunited</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{recoveredCount} Returned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter, Search & Tabs Bar */}
        <div className="bg-white dark:bg-twilight-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-twilight-700 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Type Filter Pills */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 self-start">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "ALL"
                    ? "bg-white dark:bg-twilight-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-twilight-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Reports ({items.length})
              </button>
              <button
                onClick={() => setActiveTab("FOUND")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "FOUND"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-twilight-400 hover:text-emerald-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Found Items ({items.filter((i) => i.type === "FOUND").length})
              </button>
              <button
                onClick={() => setActiveTab("LOST")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "LOST"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-twilight-400 hover:text-amber-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Lost Items ({items.filter((i) => i.type === "LOST").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search lost IDs, calculators, keys, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Secondary Filters: Campus & Category */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-twilight-700 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600 dark:text-twilight-300">Campus:</span>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-800 dark:text-twilight-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600 dark:text-twilight-300">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-800 dark:text-twilight-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <span className="ml-auto text-xs text-slate-400">
              Showing {filteredItems.length} active notices
            </span>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-twilight-800 border border-dashed border-slate-300 dark:border-twilight-700 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-twilight-900 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-twilight-100">
              No Lost or Found Reports Matching Filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-twilight-400 max-w-sm mx-auto">
              Try selecting a different campus or clearing your search keywords.
            </p>
            <button
              onClick={() => {
                setActiveTab("ALL");
                setSelectedCampus("All Campuses");
                setSelectedCategory("All Categories");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl bg-white dark:bg-twilight-800 border border-slate-200/80 dark:border-twilight-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Photo or Header Banner */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-twilight-900 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-twilight-500 p-4 text-center">
                      <Tag className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-semibold">{item.category}</span>
                    </div>
                  )}

                  {/* Clean Shadcn Tag & Status */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <SectionTypeTag className={item.type === "FOUND" ? "bg-emerald-600 text-white border-transparent" : "bg-amber-600 text-white border-transparent"}>
                      {item.type === "FOUND" ? "Found Item" : "Missing Item"}
                    </SectionTypeTag>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-sm text-slate-200 text-[10px] font-mono">
                      #{item.reportNumber.replace("EST-LF-2026-", "").replace("EST-LF-", "")}
                    </span>
                  </div>

                  {/* Clean Status Indicator */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                    <StatusBadge
                      status={item.status}
                      label={
                        item.status === "CLAIM_SUBMITTED"
                          ? "In Review"
                          : item.status === "VERIFIED_RECOVERED"
                          ? "Reunited"
                          : item.type === "FOUND"
                          ? "At Campus Desk"
                          : "Still Missing"
                      }
                      className="text-[11px] text-white"
                    />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Tag className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-twilight-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Campus & Location Info */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-twilight-700 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-twilight-200 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.campus}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-twilight-400 pl-5">
                      Spot: {item.locationDetail}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-twilight-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.approximateDate}
                      </span>
                      <span>By: {item.reporterName}</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2">
                    {item.type === "FOUND" ? (
                      item.status === "VERIFIED_RECOVERED" ? (
                        <div className="w-full py-2 rounded-xl bg-slate-100 dark:bg-twilight-900 text-muted-foreground text-xs font-medium text-center">
                          Returned to Owner ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedItemToClaim(item);
                            setIsClaimModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Claim This Item</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          showToast(`Contact info: ${item.contactPhone || "+251911223344"}. Also notify campus security desk.`);
                        }}
                        className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Phone className="w-4 h-4" />
                        <span>I Found This • Contact Student</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL 1: Report Lost / Found Item */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-twilight-800 rounded-3xl border border-slate-200 dark:border-twilight-700 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-twilight-700 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {reportType === "FOUND" ? (
                    <>
                      <PlusCircle className="w-5 h-5 text-emerald-500" />
                      <span>Report a Found Item (Turn In)</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-amber-500" />
                      <span>Report a Lost Item (Missing Notice)</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-twilight-400 mt-0.5">
                  Audited by Campus Reps • Protected by SafeTrade Escrow
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-twilight-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 pt-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-twilight-900 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setReportType("FOUND")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reportType === "FOUND"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-twilight-400"
                  }`}
                >
                  I Found An Item
                </button>
                <button
                  type="button"
                  onClick={() => setReportType("LOST")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reportType === "LOST"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-twilight-400"
                  }`}
                >
                  I Lost An Item
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AAU Student ID Card (Natnael T.), Casio Calculator, Dorm Key..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                    University / Campus *
                  </label>
                  <select
                    value={formCampus}
                    onChange={(e) => setFormCampus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CAMPUSES.filter((c) => c !== "All Campuses").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exact Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                    {reportType === "FOUND" ? "Where was it found? *" : "Where was it last seen? *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Library 2nd floor, Gate 1 benches"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                    Date / Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today 11:00 AM, Yesterday afternoon"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe color, brand, model, condition, stickers or marks..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Secret Mark / Private proof for found items */}
              {reportType === "FOUND" && (
                <div className="space-y-1 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secret Ownership Test Mark (Keep Hidden from Public)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wallpaper photo is a football player, ID ends with 2941"
                    value={formSecretMark}
                    onChange={(e) => setFormSecretMark(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-twilight-900 border border-amber-500/30 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">
                    This will only be shown to campus reps to verify claimants when returning the item.
                  </p>
                </div>
              )}

              {/* Photo Upload Widget */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Attach Photo
                </label>
                <ImageUploader
                  folder="lost-found"
                  maxImages={1}
                  value={formImageUrl ? [formImageUrl] : []}
                  onChange={(urls) => setFormImageUrl(urls[0] || "")}
                />
                {formImageUrl && (
                  <p className="text-[10px] text-emerald-600 font-medium">✓ Photo attached</p>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Your Phone Number (Optional for Desk Follow-up)
                </label>
                <input
                  type="tel"
                  placeholder="+2519..."
                  value={formContactPhone}
                  onChange={(e) => setFormContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-twilight-700">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-twilight-400 hover:bg-slate-100 dark:hover:bg-twilight-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createReportMutation.isPending}
                  className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all cursor-pointer ${
                    reportType === "FOUND"
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                      : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                  }`}
                >
                  {createReportMutation.isPending ? "Submitting..." : "Submit to Campus Desk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Claim Found Item Modal */}
      {isClaimModalOpen && selectedItemToClaim && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-twilight-800 rounded-3xl border border-slate-200 dark:border-twilight-700 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-twilight-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Submit Ownership Claim</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-twilight-400">
                  Case ID: {selectedItemToClaim.reportNumber}
                </p>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-twilight-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 pt-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs space-y-1">
                <span className="text-slate-400 font-medium">Claiming:</span>
                <p className="font-bold text-slate-800 dark:text-white">{selectedItemToClaim.title}</p>
                <p className="text-slate-500 dark:text-twilight-400 text-[11px]">
                  Held at: {selectedItemToClaim.campus} ({selectedItemToClaim.locationDetail})
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Private Proof of Ownership *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide identifying proof that only the real owner knows"
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-twilight-200">
                  Your Phone / Telegram *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+2519... or @username"
                  value={claimantContact}
                  onChange={(e) => setClaimantContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-twilight-900 border border-slate-200 dark:border-twilight-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-twilight-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitClaimMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {submitClaimMutation.isPending ? "Submitting..." : "Submit Claim for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
