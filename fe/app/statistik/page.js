"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export default function Statistik() {
  const mapRef = useRef(null);
  const chartRef = useRef(null);
  const mitraChartRef = useRef(null);
  const kegiatanChartRef = useRef(null);

  // State untuk data dari API
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/statistik");
        if (!res.ok) throw new Error("Gagal mengambil data statistik");
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hitung rata-rata tahunan
  const { avgMoU, avgMoA, avgIA } = useMemo(() => {
    if (!data) return { avgMoU: 0, avgMoA: 0, avgIA: 0 };

    const { MoU, MoA, IA } = data.yearlyData;
    const avgMoU = Math.round(MoU.reduce((a, b) => a + b, 0) / MoU.length);
    const avgMoA = Math.round(MoA.reduce((a, b) => a + b, 0) / MoA.length);
    const avgIA = Math.round(IA.reduce((a, b) => a + b, 0) / IA.length);
    return { avgMoU, avgMoA, avgIA };
  }, [data]);

  // Inisialisasi peta
  useEffect(() => {
    if (!data || typeof window === "undefined") return;

    const loadLeaflet = () => {
      if (typeof window === "undefined") return;

      // Cek apakah Leaflet sudah dimuat
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      // Hapus peta lama jika ada
      if (mapRef.current._leaflet_map) {
        mapRef.current._leaflet_map.remove();
      }

      const map = window.L.map(mapRef.current).setView([20, 0], 2);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current._leaflet_map = map;

      // Tambahkan marker
      data.markers.forEach((marker) => {
        const markerIcon = window.L.divIcon({
          className: "custom-marker",
          html: `<div class="w-4 h-4 bg-yellow-500 border-2 border-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        window.L.marker([marker.lat, marker.lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 text-sm font-medium">
              <p class="font-bold">${marker.name}</p>
              <p>MOA: ${marker.moa}</p>
              <p>MOU: ${marker.mou}</p>
              <p>IA: ${marker.ia}</p>
            </div>
          `);
      });
    };

    loadLeaflet();
  }, [data]);

useEffect(() => {
  if (!data || typeof window === "undefined") return;

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = () => {
    // Line Chart
    if (chartRef.current) {
      new window.Chart(chartRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: data.yearlyData.years,
          datasets: [
            {
              label: "MoU",
              data: data.yearlyData.MoU,
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "MoA",
              data: data.yearlyData.MoA,
              borderColor: "#EF4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "IA",
              data: data.yearlyData.IA,
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }

    // Bar Chart: Mitra - DENGAN VALIDASI
    if (mitraChartRef.current && data.mitraData?.labels && data.mitraData?.data) {
      const labels = data.mitraData.labels.map(label => label || "Tidak Diketahui");
      const values = data.mitraData.data;

      new window.Chart(mitraChartRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: "#F59E0B",
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
                font: { size: 10 },
              },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.1)' },
            },
          },
        },
      });
    }

    // Bar Chart: Kegiatan - DENGAN VALIDASI
    if (kegiatanChartRef.current && data.kegiatanData?.labels && data.kegiatanData?.data) {
      const labels = data.kegiatanData.labels.map(label => label || "Tidak Diketahui");
      const values = data.kegiatanData.data;

      new window.Chart(kegiatanChartRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: "#3B82F6",
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
                font: { size: 10 },
              },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.1)' },
            },
          },
        },
      });
    }
  };

  document.body.appendChild(script);

  return () => {
    if (script.parentNode) script.parentNode.removeChild(script);
  };
}, [data]);

  // Loading & Error
  if (loading) return <div className="p-10 text-center">Loading statistik...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#003366]">Statistik Kerja Sama Internasional</h2>
            <p className="mt-2 text-gray-700">Peta distribusi kerja sama antar institusi pendidikan tinggi.</p>
            <hr className="my-6 border-[#003366]" />
          </div>

          {/* Peta */}
          <div
            ref={mapRef}
            className="w-full h-96 md:h-[500px] bg-gray-50 rounded-lg shadow-md mb-8 z-0"
          />

          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pertumbuhan Kerjasama</h3>
            <div className="w-full h-80">
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Rata-rata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-700 font-medium">AVG MoU</p>
              <p className="text-2xl font-bold text-blue-600">{avgMoU}/thn</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-red-700 font-medium">AVG MoA</p>
              <p className="text-2xl font-bold text-red-600">{avgMoA}/thn</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-700 font-medium">AVG IA</p>
              <p className="text-2xl font-bold text-green-600">{avgIA}/thn</p>
            </div>
          </div>

          {/* Grid: Income Generate (kiri), Mitra & Kegiatan (kanan) */}
<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-8">
  {/* Kotak Income Generate - Kiri */}
  <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col h-[400px]">
    <div className="bg-[#003366] text-white px-4 py-2 text-center font-bold text-sm uppercase tracking-wide">
      Top 10 Income Generate
    </div>
    <div className="p-4 overflow-y-auto flex-grow">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 px-3 text-left text-gray-700 font-semibold">No.</th>
            <th className="py-2 px-3 text-left text-gray-700 font-semibold">Instansi</th>
            <th className="py-2 px-3 text-right text-gray-700 font-semibold">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {data.incomeData.map((item) => (
            <tr key={item.no} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-900 font-medium">{item.no}</td>
              <td className="py-2 px-3 text-gray-900 font-medium">{item.instansi}</td>
              <td className="py-2 px-3 text-gray-900 font-medium text-right">
                {item.jumlah.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Kolom Kanan: Mitra & Kegiatan (dibagi vertikal) */}
  <div className="flex flex-col gap-6 h-[400px]">
    {/* Top 5 Klasifikasi Mitra */}
    <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
      <div className="bg-[#003366] text-white px-4 py-2 text-center font-bold text-sm uppercase">
        Top 5 Klasifikasi Mitra
      </div>
      <div className="flex-grow p-2 relative">
        <div className="absolute inset-0">
          <canvas ref={mitraChartRef} />
        </div>
      </div>
    </div>

    {/* Top 5 Bentuk Kegiatan */}
    <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
      <div className="bg-[#003366] text-white px-4 py-2 text-center font-bold text-sm uppercase">
        Top 5 Bentuk Kegiatan
      </div>
      <div className="flex-grow p-2 relative">
        <div className="absolute inset-0">
          <canvas ref={kegiatanChartRef} />
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </main>
    </div>
  );
}