import { useState } from 'react';

export default function AdminBookings() {
  // 1. Dữ liệu giả lập (Mock Data) - Tổng hợp từ bookings, booking_details và payments
  const [bookings, setBookings] = useState([
    {
      id: "BK-1001",
      guest_name: "Nguyễn Văn A",
      guest_phone: "0901234567",
      check_in_date: "2026-04-10",
      check_out_date: "2026-04-12",
      total_price: 2400000,
      status: "Pending", // Pending, Confirmed, Completed, Cancelled
      created_at: "2026-03-28 08:30:00",
      payment_method: "Bank Transfer",
      rooms: [
        { name: "Phòng VIP (P201)", price: 1200000 }
      ]
    },
    {
      id: "BK-1002",
      guest_name: "Trần Thị B",
      guest_phone: "0987654321",
      check_in_date: "2026-04-15",
      check_out_date: "2026-04-16",
      total_price: 500000,
      status: "Confirmed",
      created_at: "2026-03-27 14:15:00",
      payment_method: "Credit Card",
      rooms: [
        { name: "Phòng Tiêu Chuẩn (P105)", price: 500000 }
      ]
    },
    {
      id: "BK-1003",
      guest_name: "Lê Hoàng C",
      guest_phone: "0911222333",
      check_in_date: "2026-04-01",
      check_out_date: "2026-04-05",
      total_price: 6000000,
      status: "Cancelled",
      created_at: "2026-03-25 09:00:00",
      payment_method: "Cash",
      rooms: [
        { name: "Phòng Tiêu Chuẩn (P101)", price: 500000 },
        { name: "Phòng Tiêu Chuẩn (P102)", price: 500000 },
        { name: "Phòng Tiêu Chuẩn (P103)", price: 500000 }
      ]
    }
  ]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 2. Lọc danh sách theo trạng thái
  const filteredBookings = filterStatus === "All" 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  // 3. Hàm cập nhật trạng thái đơn hàng (Duyệt / Hủy)
  const updateBookingStatus = (id, newStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái đơn này thành: ${newStatus}?`)) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      setSelectedBooking(null); // Đóng modal sau khi cập nhật
    }
  };

  // 4. Hàm format ngày tháng (từ YYYY-MM-DD sang DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm render màu sắc cho Trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Đã Duyệt</span>;
      case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Chờ Duyệt</span>;
      case 'Cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Đã Hủy</span>;
      case 'Completed': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Hoàn Thành</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Bộ lọc */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Đặt Phòng</h1>
            <p className="text-gray-500 text-sm mt-1">Duyệt, hủy và xem chi tiết hóa đơn khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Lọc theo:</span>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg text-gray-700 py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">Tất cả đơn</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Confirmed">Đã duyệt</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Mã Đơn</th>
                <th className="p-4 font-semibold text-gray-600">Khách Hàng</th>
                <th className="p-4 font-semibold text-gray-600">Ngày Check-in/out</th>
                <th className="p-4 font-semibold text-gray-600">Tổng Tiền</th>
                <th className="p-4 font-semibold text-gray-600">Trạng Thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-indigo-600">{booking.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{booking.guest_name}</p>
                    <p className="text-xs text-gray-500">{booking.guest_phone}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <div><span className="font-medium text-green-600">IN:</span> {formatDate(booking.check_in_date)}</div>
                    <div><span className="font-medium text-red-500">OUT:</span> {formatDate(booking.check_out_date)}</div>
                  </td>
                  <td className="p-4 text-orange-600 font-bold">{booking.total_price.toLocaleString('vi-VN')} đ</td>
                  <td className="p-4">{getStatusBadge(booking.status)}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="text-indigo-600 hover:text-white border border-indigo-600 hover:bg-indigo-600 px-4 py-1.5 rounded-md font-medium transition text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy đơn đặt phòng nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CỬA SỔ NỔI (MODAL) CHI TIẾT ĐƠN HÀNG */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Chi Tiết Đơn: {selectedBooking.id}</h2>
                <p className="text-indigo-200 text-sm mt-1">Đặt lúc: {selectedBooking.created_at}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-white hover:text-gray-200 text-3xl leading-none">&times;</button>
            </div>
            
            {/* Nội dung Modal (Cuộn được nếu quá dài) */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Cột trái: Thông tin khách & Thanh toán */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Thông tin khách hàng</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><span className="font-medium w-24 inline-block">Họ và tên:</span> <span className="font-bold">{selectedBooking.guest_name}</span></p>
                    <p><span className="font-medium w-24 inline-block">Điện thoại:</span> {selectedBooking.guest_phone}</p>
                    <p><span className="font-medium w-24 inline-block">Check-in:</span> {formatDate(selectedBooking.check_in_date)}</p>
                    <p><span className="font-medium w-24 inline-block">Check-out:</span> {formatDate(selectedBooking.check_out_date)}</p>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 mt-8">Thông tin thanh toán</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><span className="font-medium w-28 inline-block">Phương thức:</span> {selectedBooking.payment_method}</p>
                    <p><span className="font-medium w-28 inline-block">Trạng thái đơn:</span> {getStatusBadge(selectedBooking.status)}</p>
                  </div>
                </div>

                {/* Cột phải: Chi tiết phòng đặt (bảng booking_details) */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">Phòng đã đặt</h3>
                  
                  <div className="space-y-4 mb-6">
                    {selectedBooking.rooms.map((room, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-800">{room.name}</span>
                        <span className="text-gray-600">{room.price.toLocaleString('vi-VN')} đ/đêm</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">TỔNG CỘNG</span>
                    <span className="text-2xl font-extrabold text-orange-600">{selectedBooking.total_price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal: Các nút thao tác dựa theo trạng thái */}
            <div className="bg-gray-50 p-5 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setSelectedBooking(null)} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition">
                Đóng
              </button>
              
              {selectedBooking.status === 'Pending' && (
                <>
                  <button onClick={() => updateBookingStatus(selectedBooking.id, 'Cancelled')} className="px-5 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition">
                    Hủy Đơn
                  </button>
                  <button onClick={() => updateBookingStatus(selectedBooking.id, 'Confirmed')} className="px-5 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md">
                    Duyệt Đơn Này
                  </button>
                </>
              )}

              {selectedBooking.status === 'Confirmed' && (
                <button onClick={() => updateBookingStatus(selectedBooking.id, 'Completed')} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md">
                  Đánh dấu Hoàn Thành
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}