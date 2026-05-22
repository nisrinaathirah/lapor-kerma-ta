"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/faq");
        if (!res.ok) throw new Error("Gagal memuat FAQ");
        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Gagal memuat daftar FAQ. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-2">Frequently Asked Question</h1>
        <p className="text-gray-600">
          Kami telah merangkum pertanyaan yang paling sering diajukan untuk membantu Anda menemukan jawaban dengan cepat dan mudah.
        </p>
        <hr className="my-6 border-[#003366]" />
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {error ? (
          <div className="text-center py-6 text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        ) : loading ? (
          
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-md overflow-hidden shadow-sm"
            >
              <div className="px-6 py-4 bg-gray-100 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              </div>
              <div className="px-6 py-4 bg-white">
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div
              key={faq.id} 
              className="border border-gray-700 rounded-md overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            Tidak ada pertanyaan yang tersedia.
          </div>
        )}
      </div>

      {/* Get in touch section */}
      <div className="max-w-4xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Still have questions?</h3>
          <p className="text-gray-600 text-sm mt-1">
            If you have other questions or need further information, don't hesitate to contact us.<br />
            We are here to help you!
          </p>
        </div>
        <Link href="/contact" className="bg-[#003366] hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition-colors duration-200">
          Get in touch
        </Link>
      </div>
    </div>
  );
}