import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ChevronDown, ShieldCheck, Clock, CheckCircle2, FileText } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, hotelConfig } = useApp();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const publishedFaqs = faqs.filter((f) => f.isPublished);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#050505] text-white py-12 md:py-20 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HOTEL POLICIES & FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-white">
            Guest Rules & Information
          </h2>
          <p className="text-sm text-gray-400">
            Check-in rules, cancellation policy, ID requirements, and amenity details managed directly by hotel management.
          </p>
        </div>

        {/* Quick Hotel Policy Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Check-In & Check-Out Timings
            </div>
            <div className="text-xs text-gray-300 font-mono space-y-1">
              <div>Check-In: <strong>{hotelConfig.checkInTime}</strong></div>
              <div>Check-Out: <strong>{hotelConfig.checkOutTime}</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Valid Photo ID Mandatory
            </div>
            <p className="text-xs text-gray-300">
              Accepted IDs: Aadhaar Card, Voter ID, or School/College ID Card for students. Original physical or e-ID required.
            </p>
          </div>
        </div>

        {/* Dynamic FAQ Accordion */}
        <div className="space-y-3">
          <h3 className="text-lg font-serif italic text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span>Frequently Asked Questions</span>
          </h3>

          {publishedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 text-left font-bold text-sm text-white hover:text-[#D4AF37] flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050505] text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/10 bg-[#050505]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
