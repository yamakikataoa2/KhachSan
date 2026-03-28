import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import roomImg from '../assets/hero.png'; // 👈 Dùng luôn ảnh nội bộ của bạn cho chắc ăn!

export default function Rooms() {
  const [roomTypesDisplay, setRoomTypesDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/rooms');
        if (response.ok) {
          const data = await response.json();
          
          // 1. Chỉ lấy những phòng đang "Available" (Trống)
          const availableRooms = data.data.filter(room => room.status === 'Available');
          
          // 2. GỘP NHÓM LOẠI PHÒNG: Chỉ hiển thị 1 Thẻ đại diện cho mỗi Loại
          const uniqueTypes = [];
          const seenTypeIds = new Set();
          
          availableRooms.forEach(room => {
            if (room.room_type && !seenTypeIds.has(room.room_type.id)) {
              seenTypeIds.add(room.room_type.id);
              // Lưu thông tin Loại phòng, kèm theo ID của 1 phòng trống để truyền sang trang Đặt
              uniqueTypes.push({
                typeInfo: room.room_type,
                sampleRoomId: room.id,
                sampleRoomNumber: room.room_number
              });
            }
          });
          
          setRoomTypesDisplay(uniqueTypes);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề trang */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Phòng & Phân Hạng</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các không gian nghỉ dưỡng sang trọng, được thiết kế tinh tế để mang lại cho bạn trải nghiệm tuyệt vời nhất.
          </p>
        </div>

        {/* Trạng thái Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : roomTypesDisplay.length === 0 ? (
          /* Trạng thái Hết phòng trống */
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl mb-4 block">🏨</span>
            <p className="text-xl font-medium text-gray-700">Hiện tại khách sạn đã hết phòng trống.</p>
            <p className="mt-2 text-gray-500">Vui lòng quay lại sau hoặc liên hệ hotline để được hỗ trợ!</p>
          </div>
        ) : (
          /* Hiển thị danh sách loại phòng */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypesDisplay.map((item) => (
              <div key={item.typeInfo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
                
                {/* Ảnh minh họa */}
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={item.typeInfo.image ? `http://localhost:8000/storage/${item.typeInfo.image}` : roomImg}
                    alt={item.typeInfo.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Badge Trạng thái */}
                  <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur text-white font-extrabold px-4 py-1.5 rounded-full text-sm shadow-md border border-white/20">
                    Đang trống
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.typeInfo.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2" title={item.typeInfo.description}>
                      {item.typeInfo.description || 'Trải nghiệm không gian tuyệt vời với đầy đủ tiện nghi tiêu chuẩn.'}
                    </p>
                  </div>

                  {/* Icon Tiện ích */}
                  <div className="flex items-center gap-5 text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-lg">👥</span> {Number(item.typeInfo?.max_occupancy) ? item.typeInfo.max_occupancy : 2} Người
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-lg">🛏️</span> 1 Giường Đôi
                    </div>
                  </div>

                  {/* Phần Giá và Nút Đặt */}
                  <div className="mt-auto flex items-end justify-between pt-5 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Giá mỗi đêm</p>
                      <p className="text-2xl font-black text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.typeInfo.base_price)}
                      </p>
                    </div>
                    {/* Nút Đặt phòng sẽ truyền ID phòng mẫu sang trang Booking */}
                    <Link 
                      to={`/booking/${item.sampleRoomId}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      Đặt Ngay <span>→</span>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}