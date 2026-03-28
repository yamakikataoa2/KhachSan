import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    fetch('http://localhost:8000/api/rooms')
      .then((response) => {
        // KIỂM TRA 1: Nếu kết nối đến Backend thất bại (ví dụ lỗi 404, 500)
        // Lệnh throw này sẽ ép hệ thống nhảy thẳng xuống khối .catch() bên dưới
        if (!response.ok) {
          throw new Error('Backend chưa sẵn sàng hoặc đường dẫn API sai');
        }
        return response.json();
      })
      .then((data) => {
        // KIỂM TRA 2: Đảm bảo dữ liệu nhận được thực sự là một Mảng
        if (Array.isArray(data)) {
          setRooms(data); 
        } else {
          // Nếu Backend trả về object (ví dụ { data: [...] } của Laravel), ta cũng ép lỗi để dùng mock data tạm
          throw new Error('Dữ liệu trả về không phải là mảng');
        }
        setIsLoading(false); 
      })
      .catch((error) => {
        console.log("⚠️ Chuyển sang dùng dữ liệu mẫu do:", error.message);
        
        // Mảng dự phòng an toàn khi chưa có Backend
        const mockData = [
          { id: 1, name: "Phòng Tiêu Chuẩn", price: "500.000", capacity: 2, status: "Available" },
          { id: 2, name: "Phòng VIP", price: "1.200.000", capacity: 4, status: "Occupied" },
          { id: 3, name: "Phòng Gia Đình", price: "800.000", capacity: 4, status: "Available" },
          { id: 4, name: "Phòng Đơn", price: "300.000", capacity: 1, status: "Cleaning" },
          { id: 5, name: "Suite Tổng Thống", price: "5.000.000", capacity: 6, status: "Available" }
        ];
        
        setRooms(mockData); // Nạp mảng dự phòng vào state
        setIsLoading(false); // Tắt vòng xoay tải dữ liệu
      });
  }, []);
    
  const handleBookRoom = (roomId) => {
    navigate(`/booking/${roomId}`); 
  };

  // MÀN HÌNH CHỜ ĐƯỢC THIẾT KẾ LẠI CHUYÊN NGHIỆP HƠN
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        {/* Vòng tròn xoay (Spinner) */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-lg text-gray-600 font-medium animate-pulse">Đang tải danh sách phòng...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 1. SECTION HEADER (Tiêu đề trang) */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Danh Sách Phòng</h1>
        <p className="mt-4 text-blue-200 max-w-2xl mx-auto text-lg">
          Tìm không gian nghỉ ngơi hoàn hảo cho chuyến đi của bạn. Chúng tôi cung cấp nhiều lựa chọn đa dạng từ tiêu chuẩn đến cao cấp.
        </p>
      </div>

      {/* 2. SECTION MAIN CONTENT (Nội dung chính) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Thanh công cụ (Bộ lọc giả lập để giao diện trông thật hơn) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <span className="text-gray-600 font-medium mb-4 sm:mb-0">
            Đang hiển thị <span className="text-blue-600 font-bold">{rooms.length}</span> phòng
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Sắp xếp:</span>
            <select className="border border-gray-300 rounded-lg text-gray-700 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition">
              <option>Giá: Từ thấp đến cao</option>
              <option>Giá: Từ cao xuống thấp</option>
              <option>Sức chứa: Lớn nhất</option>
            </select>
          </div>
        </div>

        {/* Lưới danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* SỬA LỖI LOGIC: Dùng biến state 'rooms' thay vì 'roomList' */}
          {rooms.map((room) => (
            <RoomCard 
              key={room.id}
              id={room.id}            
              name={room.name} 
              price={room.price} 
              capacity={room.capacity} 
              status={room.status}
              onBook={handleBookRoom}  
            />
          ))}
        </div>

      </div>
    </div>
  );
}