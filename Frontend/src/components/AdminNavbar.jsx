import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm tạo kiểu cho link đang được chọn (Active)
  const getLinkStyle = ({ isActive }) => {
    return `flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
      ${isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }
    `;
  };

  const handleLogout = () => {
    if(window.confirm("Bạn muốn thoát phiên quản trị?")) {
      // Logic đăng xuất thực tế sẽ xử lý sau
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Admin */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/admin" className="text-xl font-extrabold tracking-wider flex items-center gap-2 text-indigo-400">
              <span className="text-2xl">⚙️</span> 
              <span>ADMIN PANEL</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-2 items-center">
            <NavLink to="/admin" end className={getLinkStyle}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/admin/room-types" className={getLinkStyle}>
              🏷️ Loại Phòng
            </NavLink>
            <NavLink to="/admin/rooms" className={getLinkStyle}>
              🚪 Phòng
            </NavLink>
            <NavLink to="/admin/bookings" className={getLinkStyle}>
              📅 Đơn Đặt
            </NavLink>
            <NavLink to="/admin/users" className={getLinkStyle}>
              👥 Tài Khoản
            </NavLink>
          </div>

          {/* Thông tin Admin & Nút Đăng xuất */}
          <div className="hidden md:flex items-center gap-4 border-l border-gray-700 pl-4 ml-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-gray-300">Quản trị viên</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors p-2"
              title="Đăng xuất"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Nút Hamburger cho Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-gray-800 border-t border-gray-700">
          <NavLink to="/admin" end onClick={() => setIsOpen(false)} className={getLinkStyle}>📊 Dashboard</NavLink>
          <NavLink to="/admin/room-types" onClick={() => setIsOpen(false)} className={getLinkStyle}>🏷️ Loại Phòng</NavLink>
          <NavLink to="/admin/rooms" onClick={() => setIsOpen(false)} className={getLinkStyle}>🚪 Phòng</NavLink>
          <NavLink to="/admin/bookings" onClick={() => setIsOpen(false)} className={getLinkStyle}>📅 Đơn Đặt</NavLink>
          <NavLink to="/admin/users" onClick={() => setIsOpen(false)} className={getLinkStyle}>👥 Tài Khoản</NavLink>
          <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-gray-700 mt-4">
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}