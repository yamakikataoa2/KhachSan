import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lưới nội dung chia làm 4 cột trên màn hình lớn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-extrabold text-white tracking-wider flex items-center gap-2">
              <span className="text-blue-500">🏨</span> HOTEL ABC
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              Biểu tượng của sự sang trọng và lòng hiếu khách. Nơi mang đến cho bạn những trải nghiệm nghỉ dưỡng tuyệt vời và đáng nhớ nhất tại trung tâm thành phố.
            </p>
          </div>

          {/* Cột 2: Đường dẫn nhanh */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Khám Phá</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-blue-400 transition-colors duration-300">Trang chủ</Link></li>
              <li><Link to="/rooms" className="hover:text-blue-400 transition-colors duration-300">Danh sách phòng</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition-colors duration-300">Dịch vụ & Tiện ích</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors duration-300">Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Liên Hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span>123 Đường Bờ Biển, Phường Du Lịch, Thành phố Biển, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <span>booking@hotelabc.com</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Nhận Bản Tin</h3>
            <p className="text-sm text-gray-400 mb-4">Đăng ký để nhận những ưu đãi mới nhất và thông tin sự kiện từ chúng tôi.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
              />
              <button 
                type="button" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md text-white font-bold transition-colors"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>

        {/* Đường kẻ ngang chia cách */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hotel ABC. Bảo lưu mọi quyền.
          </p>
          
          {/* Mạng xã hội (Giả lập bằng text/emoji) */}
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>

      </div>
    </footer>
  );
}