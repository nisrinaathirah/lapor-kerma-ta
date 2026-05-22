"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [stats, setStats] = useState({ total_mou: 0, total_moa: 0, total_ia: 0 });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false); 
  const searchRef = useRef(null); 

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/statistik")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetch statistik:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);

    if (q.length > 2) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
        setShowResults(true); 
      } catch (err) {
        console.error("Error search:", err);
        setResults([]);
        setShowResults(true);
      }
    } else {
      setResults([]);
      setShowResults(false); 
    }
  };

  const handleResultClick = () => {
    setShowResults(false); 
  };

  return (
    <section>
      {/* Blok 1: Judul + Statistik + Peta */}
      <div className="bg-[#003366] text-white pt-12 pb-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start">
          <div className="flex-1">
            <h1 className="text-[40px] font-bold mb-1">Repositori</h1>
            <h1 className="text-[40px] font-bold mb-6">
              Kemitraan Pendidikan Tinggi
            </h1>

            <div className="flex gap-12 mb-0">
              <div>
                <p className="text-[25px] font-semibold">{stats.total_mou}</p>
                <p className="text-[20px] font-normal">MoU</p>
              </div>
              <div>
                <p className="text-[25px] font-semibold">{stats.total_moa}</p>
                <p className="text-[20px] font-normal">MoA</p>
              </div>
              <div>
                <p className="text-[25px] font-semibold">{stats.total_ia}</p>
                <p className="text-[20px] font-normal">IA</p>
              </div>
            </div>
          </div>

          <div className="w-[500px] md:ml-12 -mt-12">
            <Image
              src="/peta.png"
              alt="Peta Kemitraan"
              width={280}
              height={220}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Blok 2: Pencarian */}
      <div className="bg-[#003366] pt-0 pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="mb-5 font-semibold text-2xl text-white">
            Pencarian Kemitraan
          </p>
          <div className="relative" ref={searchRef}> 
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Cari mitra, judul, atau kata kunci..."
                  value={query}
                  onChange={handleSearch}
                  onFocus={() => query.length > 2 && setShowResults(true)} 
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            {/* Dropdown hasil pencarian */}
            {showResults && (
              <div className="mt-2 bg-white rounded-xl shadow-md p-4 max-h-60 overflow-y-auto absolute z-10 w-full">
                {results.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {results.map((item) => (
                      <li key={item.id} className="py-3">
                        <Link
                          href={`/direktori?q=${encodeURIComponent(item.mitra || item.nama_mitra || item.judul_kerjasama)}`}
                          onClick={handleResultClick} 
                          className="block hover:bg-blue-50 p-2 rounded transition"
                        >
                          <p className="font-semibold text-[#003366] text-sm">
                            {item.mitra || item.nama_mitra}
                          </p>
                          <p className="text-sm text-gray-800 font-medium mt-1">
                            {item.judul_kerjasama}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {item.bentuk_kerjasama}
                            </span>
                            <span
                              className={`px-2 py-1 rounded ${
                                item.status_kerjasama === "Aktif"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status_kerjasama || "Tidak ada status"}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-3 text-sm">
                    Data tidak tersedia
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}