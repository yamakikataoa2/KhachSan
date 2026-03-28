import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Thêm state để lưu thông báo lỗi từ Backend trả về
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Xóa lỗi cũ khi bấm đăng nhập lại

    try {
      // 1. Gọi API đến Backend Laravel
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Báo cho Laravel biết ta muốn nhận JSON
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      // 2. Chuyển đổi dữ liệu trả về
      const data = await response.json();

      // 3. Kiểm tra kết quả
      if (response.ok) {
        // ĐĂNG NHẬP THÀNH CÔNG: Lưu Token thật và Tên thật vào trình duyệt
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.user.full_name); 
        localStorage.setItem('userRole', data.user.role); // Lưu thêm vai trò (Admin/Khách) để sau này dùng
        
        setIsLoading(false);
        
        // Kiểm tra vai trò để đẩy về đúng trang
        if (data.user.role === 'admin') {
          navigate('/admin'); // Admin thì cho vào Dashboard
        } else {
          navigate('/'); // Khách thì cho ra Trang chủ
        }
        
        window.location.reload(); // Tải lại để Navbar cập nhật tên
      } else {
        // ĐĂNG NHẬP THẤT BẠI: Báo lỗi (Sai pass, sai email...)
        setError(data.message || 'Lỗi đăng nhập, vui lòng thử lại.');
        setIsLoading(false);
      }
      
    } catch (err) {
      // LỖI MẠNG: Backend chưa bật
      console.log("Lỗi kết nối:", err);
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-blue-600 tracking-wider flex justify-center items-center gap-2 mb-4">
            <span>🏨</span> HOTEL ABC
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h2>
          <p className="text-gray-500 mt-2 text-sm">Đăng nhập để quản lý đặt phòng của bạn</p>
        </div>

        {/* Khối hiển thị thông báo lỗi màu đỏ */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              placeholder="nhap@email.com" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Quên mật khẩu?</a>
            </div>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex justify-center items-center gap-2
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
            Đăng ký ngay
          </Link>
        </p>

      </div>
    </div>
  );
}