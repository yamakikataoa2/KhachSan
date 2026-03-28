import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// 📦 Dữ liệu mẫu (Đã bổ sung thêm hình ảnh và đổi giá thành số để dễ tính toán)
const mockRoomDatabase = [
  { id: 1, name: "Phòng Tiêu Chuẩn", price: 500000, capacity: 2, status: "Available", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop" },
  { id: 2, name: "Phòng VIP", price: 1200000, capacity: 4, status: "Occupied", image: "https://images.unsplash.com/photo-1590490360182-c33d59735088?q=80&w=600&auto=format&fit=crop" },
  { id: 3, name: "Phòng Gia Đình", price: 800000, capacity: 4, status: "Available", image: "https://images.unsplash.com/photo-1608198399264-39fe42ca1d2d?q=80&w=600&auto=format&fit=crop" },
  { id: 4, name: "Phòng Đơn", price: 300000, capacity: 1, status: "Cleaning", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop" }
];

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Trạng thái cho nút Xác nhận (tạo hiệu ứng loading khi bấm)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔍 Tìm phòng theo ID
  const roomDetail = mockRoomDatabase.find((room) => room.id === Number(id));

  // 🛡️ Bắt lỗi nếu URL sai ID
  if (!roomDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold text-gray-800">Không tìm thấy phòng</h2>
        <p className="mt-4 text-gray-600 mb-8 text-center">Rất tiếc, căn phòng bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ.</p>
        <Link to="/rooms" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
          ← Quay lại danh sách phòng
        </Link>
      </div>
    );
  }

  // 🧮 Tính toán chi phí (Giả sử khách đặt 1 đêm, tính thêm 10% VAT)
  const vatAmount = roomDetail.price * 0.1;
  const totalAmount = roomDetail.price + vatAmount;

  // Hàm xử lý khi bấm nút "Xác nhận đặt phòng"
  const handleSubmit = (e) => {
    e.preventDefault(); // Chặn hành vi tải lại trang mặc định của Form
    setIsSubmitting(true);
    
    // Giả lập thời gian gửi dữ liệu lên Backend mất 2 giây
    setTimeout(() => {
      alert("🎉 Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      navigate('/'); // Đẩy người dùng về trang chủ
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Hoàn Tất Đặt Phòng</h1>
          <p className="mt-2 text-gray-600">Vui lòng điền thông tin bên dưới để xác nhận giữ chỗ.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin liên hệ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <input required type="text" placeholder="VD: Nguyễn Văn A" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input required type="tel" placeholder="VD: 0912345678" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ Email</label>
                <input type="email" placeholder="VD: email@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận phòng *</label>
                  <input required type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả phòng *</label>
                  <input required type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đặc biệt (Tùy chọn)</label>
                <textarea rows="3" placeholder="Yêu cầu đón sân bay, giường phụ..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition duration-300 shadow-md flex justify-center items-center gap-2
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận & Thanh toán'
                )}
              </button>
            </form>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              {/* Ảnh phòng */}
              <div className="h-48 overflow-hidden">
                <img src={roomDetail.image} alt={roomDetail.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{roomDetail.name}</h3>
                <p className="text-gray-600 flex items-center gap-2 mb-6">
                  <span>👥</span> Sức chứa tối đa: {roomDetail.capacity} người
                </p>

                <div className="space-y-4 border-t border-b py-6 mb-6 text-gray-700">
                  <div className="flex justify-between">
                    <span>Giá phòng (1 đêm)</span>
                    <span className="font-semibold">{roomDetail.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế & Phí (10%)</span>
                    <span className="font-semibold">{vatAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-orange-600">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}