"use client";
import { useState, useEffect } from "react";

export default function FAQ() {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/faq")
      .then((res) => res.json())
      .then((data) => setFaqData(data))
      .catch((err) => console.error("Error fetch FAQ:", err));
  }, []);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* LEFT SIDE: Judul */}
        <div className="md:w-1/3 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-2">
            Frequently asked
          </h2>
          <span className="text-[#003366] text-3xl md:text-4xl font-bold">
            questions
          </span>
        </div>

        {/* RIGHT SIDE: FAQ List */}
        <div className="md:w-2/3 space-y-4">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 focus:outline-none"
                onClick={() => toggleIndex(index)}
              >
                <span>{item.question}</span>
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
                    openIndex === index
                      ? "bg-[#003366] text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {openIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="p-4 text-gray-600 border-t border-gray-200">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
