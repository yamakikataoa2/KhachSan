import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/env';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // "Hứng" ID phòng từ URL route parameter
  const roomId = id;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_id: roomId || '',
    customer_name: localStorage.getItem('userName') || '', // Tự động lấy tên nếu đã Login
    customer_phone: '',
    check_in_date: '',
    check_out_date: '',
    note: ''
  });

  // Nếu khách mâm men vào thẳng đường dẫn /booking mà chưa chọn phòng, đuổi về trang Rooms
  useEffect(() => {
    if (!roomId) {
      alert("Vui lòng chọn phòng trước khi tiến hành đặt!");
      navigate('/rooms');
    }
  }, [roomId, navigate]);

  // Xử lý khi khách bấm Đặt Phòng
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra logic ngày tháng cơ bản
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      alert("Ngày nhận phòng không được ở trong quá khứ!");
      return;
    }
    if (checkIn >= checkOut) {
      alert("Ngày trả phòng phải diễn ra SAU ngày nhận phòng!");
      return;
    }

    // Yêu cầu đăng nhập mới được đặt phòng (Tùy chọn, bạn có thể bỏ qua nếu muốn khách vãng lai cũng đặt được)
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert("Vui lòng đăng nhập để hệ thống ghi nhận đơn đặt phòng của bạn!");
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API gửi đơn lên Laravel (Chúng ta sẽ viết API này ở bước sau)
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("🎉 Đặt phòng thành công! Cảm ơn bạn đã lựa chọn khách sạn của chúng tôi.");
        navigate('/'); // Đẩy về trang chủ
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Vui lòng kiểm tra lại thông tin."));
      }
    } catch (error) {
      console.error("Lỗi gửi đơn:", error);
      alert("Không thể kết nối đến hệ thống. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Đặt Phòng */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header Card */}
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-3xl font-extrabold mb-2">Xác Nhận Đặt Phòng</h1>
            <p className="text-blue-100">Vui lòng điền thông tin để hoàn tất giữ chỗ</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Thông tin phòng (Đọc từ URL, chỉ hiển thị không cho sửa) */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Phòng đang chọn</p>
                <p className="text-2xl font-black text-gray-900">#{roomId}</p>
              </div>
              <div className="text-4xl">🏨</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1: Thông tin khách hàng */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">1. Thông tin liên hệ</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên *</label>
                  <input type="text" required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="VD: Nguyễn Văn A" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="tel" required value={formData.customer_phone} onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="VD: 0912345678" />
                </div>
              </div>

              {/* Cột 2: Thời gian lưu trú */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">2. Thời gian lưu trú</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng (Check-in) *</label>
                  <input type="date" required value={formData.check_in_date} onChange={(e) => setFormData({...formData, check_in_date: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng (Check-out) *</label>
                  <input type="date" required value={formData.check_out_date} onChange={(e) => setFormData({...formData, check_out_date: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" />
                </div>
              </div>
            </div>

            {/* Ghi chú thêm */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt (Không bắt buộc)</label>
              <textarea rows="3" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition resize-none" placeholder="Bạn có yêu cầu gì thêm không? (VD: Cần thêm gối, đón tại sân bay...)"></textarea>
            </div>

            {/* Nút Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30'}`}
            >
              {isLoading ? 'Đang xử lý...' : 'Hoàn Tất Đặt Phòng'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}