import { useState, useEffect } from 'react';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]); // State lưu danh sách loại phòng
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null, room_number: '', room_type_id: '', status: 'Available'
  });

  const token = localStorage.getItem('userToken');

  // 1. Hàm gọi API lấy dữ liệu Phòng và Loại Phòng
  const fetchData = async () => {
    try {
      // Lấy danh sách phòng
      const resRooms = await fetch('http://localhost:8000/api/rooms');
      if (resRooms.ok) {
        const dataRooms = await resRooms.json();
        setRooms(dataRooms.data);
      }

      // Lấy danh sách loại phòng (Bắt buộc phải có token vì đặt trong middleware auth)
      const resTypes = await fetch('http://localhost:8000/api/room-types', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resTypes.ok) {
        const dataTypes = await resTypes.json();
        setRoomTypes(dataTypes.data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Mở Modal Thêm/Sửa
  const openModal = (room = null) => {
    if (room) {
      setIsEditing(true);
      setFormData({ 
        id: room.id, 
        room_number: room.room_number, 
        room_type_id: room.room_type_id || room.room_type.id, 
        status: room.status 
      });
    } else {
      setIsEditing(false);
      setFormData({ 
        id: null, 
        room_number: '', 
        room_type_id: roomTypes.length > 0 ? roomTypes[0].id : '', // Mặc định chọn loại đầu tiên
        status: 'Available' 
      });
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu dữ liệu (Thêm mới hoặc Cập nhật)
  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEditing ? `http://localhost:8000/api/rooms/${formData.id}` : 'http://localhost:8000/api/rooms';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(isEditing ? "Cập nhật phòng thành công!" : "Thêm phòng thành công!");
        setIsModalOpen(false);
        fetchData(); // Load lại bảng
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Kiểm tra lại dữ liệu nhập."));
      }
    } catch (error) {
      console.error("Lỗi lưu phòng:", error);
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/rooms/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          fetchData(); // Load lại bảng
        }
      } catch (error) {
        console.error("Lỗi xóa phòng:", error);
      }
    }
  };

  // Hàm render Badge trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Trống</span>;
      case 'Occupied': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Có Khách</span>;
      case 'Cleaning': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Đang Dọn</span>;
      case 'Maintenance': return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Bảo Trì</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Phòng</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý danh sách phòng và trạng thái hiện tại</p>
          </div>
          <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md flex items-center gap-2">
            <span className="text-xl">+</span> Thêm Phòng Mới
          </button>
        </div>

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Số Phòng</th>
                <th className="p-4 font-semibold text-gray-600">Loại Phòng</th>
                <th className="p-4 font-semibold text-gray-600">Giá Cơ Bản</th>
                <th className="p-4 font-semibold text-gray-600">Trạng Thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800 text-lg">{room.room_number}</td>
                  {/* Sử dụng dữ liệu JOIN từ Laravel để hiển thị tên loại phòng */}
                  <td className="p-4 font-medium text-gray-700">{room.room_type?.name || 'Không xác định'}</td>
                  {/* Sử dụng dữ liệu JOIN để lấy giá */}
                  <td className="p-4 text-indigo-600 font-bold">
                    {room.room_type ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.room_type.base_price) : '0 ₫'}
                  </td>
                  <td className="p-4">{getStatusBadge(room.status)}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => openModal(room)} className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded">Sửa</button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Đang tải dữ liệu phòng...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Cập Nhật Phòng' : '✨ Thêm Phòng Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số Phòng (Tên Phòng) *</label>
                <input type="text" required value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none uppercase" placeholder="VD: P101, VIP-01" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại Phòng *</label>
                <select required value={formData.room_type_id} onChange={(e) => setFormData({...formData, room_type_id: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none">
                  <option value="" disabled>-- Chọn loại phòng --</option>
                  {/* Đổ danh sách loại phòng từ Database vào Dropdown */}
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái *</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none">
                  <option value="Available">Trống (Sẵn sàng)</option>
                  <option value="Occupied">Đang có khách</option>
                  <option value="Cleaning">Đang dọn dẹp</option>
                  <option value="Maintenance">Đang bảo trì</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}