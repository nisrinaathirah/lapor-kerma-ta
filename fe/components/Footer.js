import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white py-8 mt-0">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-sm text-[#003366] item-start">
        
      {/* Bagian kiri */}
      <div className="flex items-start gap-4">
          {/* Logo */}
          <img 
            src="/logo2.png" 
            alt="Logo Kementerian" 
            className="w-20 h-20 object-contain" 
          />
          
          {/* Teks */}
          <div className="space-y-1">
            <h3 className="font-kadwa text-[18px] font-bold">Kementerian Pendidikan</h3>
            <p className="font-kadwa text-[18px] font-bold pt-0 leading-tight">Tinggi, Sains, dan Teknologi</p>
            <p className="text-gray-800 font-sans text-[14px]">Jalan Jend. Sudirman Pintu I Senayan</p>
            <p className="text-gray-800 font-sans text-[14px]">Jakarta</p>
          </div>
        </div>
        
        {/* Bagian Tengah */}
        <div className="space-y-2 pl-18">
          <h3 className="font-kadwa text-[18px] font-bold">Tautan Penting</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a 
                href="https://kemdiktisaintek.go.id/tentang-kami/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline"
              >
                Dikti
              </a>
            </li>
            <li>
              <a 
                href="https://ats.data.kemendikdasmen.go.id/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline"
              >
                Kemendikdasmen
              </a>
            </li>
            <li>
              <a 
                href="https://www.kemenbud.go.id/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline"
              >
                Kemenbud
              </a>
            </li>
          </ul>
        </div>
        
        {/* Bagian Kanan */}
        <div className="space-y-2">
          <h3 className="font-kadwa text-[18px] font-bold">Sosial Media</h3>
          <div className="flex gap-4 mt-2 text-gray-600">
            <a href="#" className="hover:text-[#003366]"><FaFacebookF size={16} /></a>
            <a href="#" className="hover:text-[#003366]"><FaTwitter size={16} /></a>
            <a href="#" className="hover:text-[#003366]"><FaInstagram size={16} /></a>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-200 text-center text-xs text-gray-500 mt-6 py-2">
        © Copyright DIKTI . All Rights Reserved
      </div>
    </footer>
  );
}