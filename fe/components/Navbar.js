"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    salutation: "",
    fullName: "",
    email: "",
    phone: "",
    group: "",
    institution: "",
    password: "",
    assignmentLetter: null,
  });

  const router = useRouter();

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", loginData);
    alert("Login berhasil!");
    setIsLoginOpen(false);
    router.push("/admin");
  };

  // Handle Register
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registration:", registerData);
    alert("Registrasi berhasil!");
    setIsRegisterOpen(false);
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      assignmentLetter: e.target.files[0],
    }));
  };

  const isModalOpen = isLoginOpen || isRegisterOpen;

  return (
    <>
      {/* Navbar hanya muncul jika tidak ada modal */}
      {!isModalOpen && (
        <nav
          className={`bg-[#003366] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-[110] ${
            isHomePage ? "" : "shadow-md"
          }`}
        >
          {/* Logo + Title */}
          <div className="flex items-center gap-0">
            <img src="/logo.png" alt="Logo" className="w-20 h-20" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg">LAPOR KERMA</span>
              <span className="text-xs">
                Kementerian Pendidikan Tinggi, Sains, dan Teknologi
              </span>
            </div>
          </div>

          {/* Menu + Button */}
          <div className="flex items-center gap-6">
            <ul className="hidden md:flex gap-6">
              <li>
                <Link href="/" className="hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/direktori" className="hover:underline">
                  Direktori
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="hover:underline">
                  Statistik
                </Link>
              </li>
              <li>
                <Link href="/FAQ" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500"
            >
              Login
            </button>
          </div>
        </nav>
      )}

      {/* Modal Login */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[120] p-4"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsLoginOpen(false);
                router.push("/");
              }}
              className="absolute top-4 left-4 text-gray-600 hover:text-[#003366] transition-colors"
              aria-label="Kembali ke beranda"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v14a1 1 0 001 1h2"
                />
              </svg>
            </button>

            <div className="flex justify-center mb-8">
              <img
                src="/logo.png"
                alt="Logo LAPOR KERMA"
                className="w-16 h-16"
              />
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 4.5.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75z"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Masukkan sandi"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v6h8z"
                  />
                </svg>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-[#003366] font-medium"
                >
                  Lupa sandi?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#003366] hover:bg-[#002c5b] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
              >
                Login
              </button>

              <div className="text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="font-semibold text-[#003366] hover:underline"
                >
                  DAFTAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Daftar */}
      {isRegisterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[120] p-4"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pt-6">
              <h2 className="text-xl text-[#003366] font-bold text-center mb-6">
                REGISTRATION
              </h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salutation
                  </label>
                  <select
                    name="salutation"
                    value={registerData.salutation}
                    onChange={handleRegisterInputChange}
                    className="w-full text-gray-800 font-medium pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    required
                  >
                    <option value="" className="text-gray-400">
                      -- Pilih --
                    </option>
                    <option value="Bpk/Sdr." className="text-gray-800">
                      Bpk/Sdr.
                    </option>
                    <option value="Ibu/Sdri." className="text-gray-800">
                      Ibu/Sdri.
                    </option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Masukkan nama lengkap anda"
                    value={registerData.fullName}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email anda"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Masukkan nomor ponsel anda"
                    value={registerData.phone}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <select
                    name="group"
                    value={registerData.group}
                    onChange={handleRegisterInputChange}
                    className="w-full text-gray-800 font-medium pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    required
                  >
                    <option value="" className="text-gray-400">
                      --Pilih--
                    </option>
                    <option value="Admin Perguruan Tinggi" className="text-gray-800">
                      Admin Perguruan Tinggi
                    </option>
                    <option value="Admin LLDIKTI" className="text-gray-800">
                      Admin LLDIKTI
                    </option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    placeholder="Search for a repository"
                    value={registerData.institution}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Masukkan sandi"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment letter
                  </label>
                  <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                    <span className="text-xs text-gray-500 mr-2">Choose file</span>
                    <input
                      type="file"
                      name="assignmentLetter"
                      onChange={handleFileChange}
                      className="hidden"
                      id="assignmentLetter"
                    />
                    <label
                      htmlFor="assignmentLetter"
                      className="text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                    >
                      {registerData.assignmentLetter
                        ? registerData.assignmentLetter.name
                        : "No file chosen"}
                    </label>
                    {registerData.assignmentLetter && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegisterData((prev) => ({
                            ...prev,
                            assignmentLetter: null,
                          }));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label="Hapus file"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#003366] hover:bg-[#002c5b] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                >
                  SUBMIT
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterOpen(false);
                      router.push("/");
                    }}
                    className="font-semibold text-[#003366] hover:underline"
                  >
                    Back home
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}