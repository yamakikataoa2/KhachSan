import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. Kiểm tra logic cơ bản ở Frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 2. Gọi API Đăng ký của Laravel
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          full_name: formData.fullName, // Backend Laravel nhận biến tên là 'name'
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword 
        })
      });

      const data = await response.json();

      // 3. Xử lý kết quả
      if (response.ok) {
        // ĐĂNG KÝ THÀNH CÔNG: Lưu Token và tự động Đăng nhập luôn
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.user.full_name);
        localStorage.setItem('userRole', data.user.role);
        
        setIsLoading(false);
        alert("🎉 Đăng ký thành công! Đang tự động đăng nhập...");
        
        navigate('/'); // Đẩy về trang chủ (vì tài khoản mới luôn là customer)
        window.location.reload(); // Tải lại Navbar
      } else {
        // ĐĂNG KÝ THẤT BẠI: Xử lý lỗi từ Laravel (ví dụ: Trùng email)
        if (data.errors && data.errors.email) {
          setError('Email này đã được sử dụng. Vui lòng dùng email khác.');
        } else {
          setError(data.message || 'Lỗi đăng ký, vui lòng kiểm tra lại thông tin.');
        }
        setIsLoading(false);
      }
      
    } catch (err) {
      console.log("Lỗi kết nối:", err);
      setError('Không thể kết nối đến máy chủ Backend.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-blue-600 tracking-wider flex justify-center items-center gap-2 mb-4">
            <span>🏨</span> HOTEL ABC
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
          <p className="text-gray-500 mt-2 text-sm">Trở thành thành viên để nhận ưu đãi đặt phòng đặc quyền</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="0912345678" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="nhap@email.com" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="Ít nhất 6 ký tự" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="Nhập lại mật khẩu" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all shadow-md flex justify-center items-center gap-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}>
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Hoàn Tất Đăng Ký'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">Đăng nhập ngay</Link>
        </p>

      </div>
    </div>
  );
}