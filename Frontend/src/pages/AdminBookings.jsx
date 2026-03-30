import { useState, useEffect } from 'react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('userToken');

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Xử lý đổi trạng thái
  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm(`Bạn muốn chuyển trạng thái đơn này thành "${newStatus}"?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          fetchBookings(); // Cập nhật lại bảng
        } else {
          alert("Có lỗi xảy ra khi cập nhật!");
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    }
  };

  // Trang trí nhãn trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Chờ Duyệt</span>;
      case 'Confirmed': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Đã Xác Nhận</span>;
      case 'Completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Hoàn Thành</span>;
      case 'Cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Đã Hủy</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Đặt Phòng</h1>
          <p className="text-gray-500 text-sm mt-1">Duyệt đơn và theo dõi doanh thu phòng nghỉ</p>
        </div>

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Mã Đơn</th>
                <th className="p-4 font-semibold text-gray-600">Khách Hàng</th>
                <th className="p-4 font-semibold text-gray-600">Phòng</th>
                <th className="p-4 font-semibold text-gray-600">Lịch Trình</th>
                <th className="p-4 font-semibold text-gray-600">Tổng Tiền</th>
                <th className="p-4 font-semibold text-gray-600">Trạng Thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-500">#{booking.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{booking.customer_name}</p>
                    <p className="text-xs text-gray-500">{booking.customer_phone}</p>
                  </td>
                  <td className="p-4 font-bold text-indigo-600 text-lg">
                    {booking.room?.room_number || 'Phòng đã xóa'}
                  </td>
                  <td className="p-4 text-sm">
                    <p><span className="text-gray-500">In:</span> {booking.check_in_date}</p>
                    <p><span className="text-gray-500">Out:</span> {booking.check_out_date}</p>
                  </td>
                  <td className="p-4 font-black text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_price)}
                  </td>
                  <td className="p-4">{getStatusBadge(booking.status)}</td>
                  <td className="p-4 text-center">
                    {/* Nút thao tác đổi trạng thái nhanh */}
                    <select 
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      value={booking.status}
                      className="px-3 py-1.5 border rounded-lg bg-white text-sm font-medium outline-none cursor-pointer focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="Pending">⏳ Chờ duyệt</option>
                      <option value="Confirmed">✅ Xác nhận</option>
                      <option value="Completed">🎉 Hoàn thành</option>
                      <option value="Cancelled">❌ Hủy bỏ</option>
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Chưa có đơn đặt phòng nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}