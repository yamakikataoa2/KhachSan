import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminRooms() {
  // 1. Dữ liệu phòng ban đầu
  const [rooms, setRooms] = useState([
    { id: 1, name: "Phòng Tiêu Chuẩn", price: 500000, capacity: 2, status: "Available" },
    { id: 2, name: "Phòng VIP", price: 1200000, capacity: 4, status: "Occupied" },
  ]);

  // 2. Các state quản lý cửa sổ nhập liệu (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State lưu trữ dữ liệu của form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    capacity: 1,
    status: 'Available'
  });

  // 3. HÀM MỞ MODAL (Dùng chung cho cả Thêm và Sửa)
  const openModal = (room = null) => {
    if (room) {
      // Nếu có truyền room vào -> Chế độ Sửa
      setIsEditing(true);
      setFormData(room);
    } else {
      // Nếu không có room -> Chế độ Thêm mới
      setIsEditing(false);
      setFormData({ id: null, name: '', price: '', capacity: 1, status: 'Available' });
    }
    setIsModalOpen(true);
  };

  // 4. HÀM LƯU DỮ LIỆU (Thêm hoặc Cập nhật)
  const handleSave = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Logic Cập nhật: Tìm phòng có id tương ứng và thay thế bằng dữ liệu mới
      setRooms(rooms.map(r => r.id === formData.id ? formData : r));
      alert("Cập nhật phòng thành công!");
    } else {
      // Logic Thêm mới: Tạo ID giả ngẫu nhiên và nhét vào mảng
      const newRoom = { ...formData, id: Date.now() };
      setRooms([...rooms, newRoom]);
      alert("Thêm phòng mới thành công!");
    }
    setIsModalOpen(false); // Đóng modal
  };

  // 5. HÀM XÓA PHÒNG
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Tiêu đề & Nút Thêm */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phòng</h1>
            <p className="text-gray-500 text-sm mt-1">Hệ thống quản trị nội bộ Khách sạn ABC</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md flex items-center gap-2"
          >
            <span className="text-xl">+</span> Thêm Phòng Mới
          </button>
        </div>

        {/* Bảng danh sách phòng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Tên Phòng</th>
                <th className="p-4 font-semibold text-gray-600">Giá (VNĐ)</th>
                <th className="p-4 font-semibold text-gray-600">Sức Chứa</th>
                <th className="p-4 font-semibold text-gray-600">Trạng Thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500">#{room.id.toString().slice(-4)}</td>
                  <td className="p-4 font-bold text-gray-800">{room.name}</td>
                  <td className="p-4 text-orange-600 font-semibold">{Number(room.price).toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 text-gray-600">{room.capacity} người</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      room.status === 'Available' ? 'bg-green-100 text-green-700' : 
                      room.status === 'Occupied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => openModal(room)} className="text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-800 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Chưa có dữ liệu phòng. Hãy thêm mới!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CỬA SỔ NỔI (MODAL) THÊM/SỬA PHÒNG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Cập Nhật Phòng' : '✨ Thêm Phòng Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng</label>
                <input 
                  type="text" required value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                  placeholder="VD: Phòng Suite Cao Cấp"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá phòng (VNĐ)</label>
                  <input 
                    type="number" required value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (Người)</label>
                  <input 
                    type="number" min="1" required value={formData.capacity} 
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                >
                  <option value="Available">Trống (Available)</option>
                  <option value="Occupied">Đang có khách (Occupied)</option>
                  <option value="Cleaning">Đang dọn dẹp (Cleaning)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md">
                  {isEditing ? 'Lưu Thay Đổi' : 'Thêm Phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}