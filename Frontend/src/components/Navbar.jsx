import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Thêm biến trạng thái để lưu tên người dùng
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  // 2. Kiểm tra bộ nhớ trình duyệt ngay khi Navbar xuất hiện
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []); // [] đảm bảo chỉ chạy 1 lần lúc mở web

  // 3. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Xóa sạch dữ liệu trong bộ nhớ
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    setUserName(null); // Cập nhật lại giao diện ngay lập tức
    navigate('/'); // Đẩy về trang chủ
  };

  const getLinkStyle = ({ isActive }) => {
    return `relative font-medium text-base transition-colors duration-300 py-1
      ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}
      after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] 
      after:bg-blue-600 after:transition-transform after:duration-300 after:origin-left
      ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
    `;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Khách sạn */}
          <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <Link to="/" className="text-3xl font-extrabold text-blue-700 tracking-wider flex items-center gap-2">
              <span>🏨</span> HOTEL ABC
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-10 items-center mt-1">
            <NavLink to="/" className={getLinkStyle}>Trang chủ</NavLink>
            <NavLink to="/rooms" className={getLinkStyle}>Phòng nghỉ</NavLink>
            <NavLink to="/services" className={getLinkStyle}>Dịch vụ</NavLink>
          </div>

          {/* Nút Đăng nhập / Đăng xuất & Đặt phòng */}
          <div className="flex items-center gap-6">
            
            {/* 4. Giao diện thay đổi dựa trên trạng thái Đăng nhập (Màn hình lớn) */}
            <div className="hidden md:flex items-center gap-4">
              {userName ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium border-r pr-3">👋 Chào, {userName}</span>
                  <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Đăng nhập
                </Link>
              )}
            </div>

            <Link 
              to="/rooms" 
              className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Đặt phòng ngay
            </Link>

            {/* Nút Hamburger cho điện thoại */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Menu thả xuống cho Mobile */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-gray-50 border-t">
          
          {/* 5. Giao diện thay đổi dựa trên trạng thái Đăng nhập (Màn hình điện thoại) */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            {userName ? (
              <div className="flex justify-between items-center px-3">
                <span className="text-gray-700 font-medium">👋 {userName}</span>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-500 font-bold text-sm">Đăng xuất</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">
                Đăng nhập tài khoản
              </Link>
            )}
          </div>

          <NavLink to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Trang chủ</NavLink>
          <NavLink to="/rooms" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Phòng nghỉ</NavLink>
          <NavLink to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Dịch vụ</NavLink>
          
          <Link to="/rooms" onClick={() => setIsOpen(false)} className="block mt-4 text-center bg-blue-600 text-white px-3 py-3 rounded-md font-bold shadow-sm">
            Đặt phòng ngay
          </Link>
        </div>
      </div>
    </nav>
  );
}