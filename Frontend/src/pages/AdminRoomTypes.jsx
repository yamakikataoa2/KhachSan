import { useState } from 'react';

export default function AdminRoomTypes() {
  // 1. Mock Data bám sát cấu trúc bảng room_types trong MySQL
  const [roomTypes, setRoomTypes] = useState([
    { 
      id: 1, 
      name: "Phòng Tiêu Chuẩn (Standard)", 
      description: "Phòng cơ bản với đầy đủ tiện nghi, phù hợp cho cá nhân hoặc cặp đôi.", 
      base_price: 500000, 
      max_occupancy: 2 
    },
    { 
      id: 2, 
      name: "Phòng VIP (Suite)", 
      description: "Không gian rộng rãi, view toàn cảnh thành phố, nội thất cao cấp.", 
      base_price: 1500000, 
      max_occupancy: 4 
    },
    { 
      id: 3, 
      name: "Phòng Gia Đình (Family)", 
      description: "Phòng đôi kết nối, có khu vực sinh hoạt chung và bếp mini.", 
      base_price: 1200000, 
      max_occupancy: 5 
    }
  ]);

  // 2. Quản lý trạng thái Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State lưu dữ liệu form (Khớp với các cột trong DB)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    base_price: '',
    max_occupancy: 1
  });

  // 3. Mở Modal Thêm/Sửa
  const openModal = (type = null) => {
    if (type) {
      setIsEditing(true);
      setFormData(type);
    } else {
      setIsEditing(false);
      setFormData({ id: null, name: '', description: '', base_price: '', max_occupancy: 1 });
    }
    setIsModalOpen(true);
  };

  // 4. Xử lý Lưu dữ liệu
  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setRoomTypes(roomTypes.map(rt => rt.id === formData.id ? formData : rt));
    } else {
      const newType = { ...formData, id: Date.now() }; // Fake ID auto_increment
      setRoomTypes([...roomTypes, newType]);
    }
    setIsModalOpen(false);
  };

  // 5. Xử lý Xóa
  const handleDelete = (id) => {
    if (window.confirm("Cảnh báo: Xóa loại phòng này có thể ảnh hưởng đến các phòng đang sử dụng nó. Bạn có chắc chắn?")) {
      setRoomTypes(roomTypes.filter(rt => rt.id !== id));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Loại Phòng</h1>
            <p className="text-gray-500 text-sm mt-1">Định nghĩa các hạng phòng, giá gốc và sức chứa</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md flex items-center gap-2"
          >
            <span className="text-xl">+</span> Thêm Loại Phòng
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 w-16">ID</th>
                <th className="p-4 font-semibold text-gray-600 w-1/4">Tên Loại Phòng</th>
                <th className="p-4 font-semibold text-gray-600 w-1/3">Mô Tả</th>
                <th className="p-4 font-semibold text-gray-600">Giá Gốc (VNĐ)</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Sức Chứa</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((type) => (
                <tr key={type.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500 font-medium">{type.id}</td>
                  <td className="p-4 font-bold text-gray-800">{type.name}</td>
                  <td className="p-4 text-gray-600 text-sm">
                    {/* Giới hạn độ dài mô tả để bảng không bị vỡ */}
                    <p className="line-clamp-2">{type.description}</p>
                  </td>
                  <td className="p-4 text-orange-600 font-bold">{Number(type.base_price).toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 text-gray-700 text-center font-medium">👤 {type.max_occupancy}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => openModal(type)} className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded">Sửa</button>
                    <button onClick={() => handleDelete(type.id)} className="text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
              {roomTypes.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Chưa có dữ liệu. Hãy thêm loại phòng đầu tiên!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Cập Nhật Loại Phòng' : '✨ Thêm Loại Phòng Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại phòng (name) *</label>
                <input 
                  type="text" required value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition" 
                  placeholder="VD: Phòng Suite Cao Cấp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết (description) *</label>
                <textarea 
                  required rows="3" value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none" 
                  placeholder="Mô tả các tiện nghi, view, diện tích..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc / Đêm (base_price) *</label>
                  <div className="relative">
                    <input 
                      type="number" required min="0" value={formData.base_price} 
                      onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                      className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition" 
                    />
                    <span className="absolute right-4 top-2 text-gray-500">VNĐ</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa tối đa (max_occupancy) *</label>
                  <div className="relative">
                    <input 
                      type="number" required min="1" max="20" value={formData.max_occupancy} 
                      onChange={(e) => setFormData({...formData, max_occupancy: e.target.value})}
                      className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition" 
                    />
                     <span className="absolute right-4 top-2 text-gray-500">Người</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 border-t pt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                  Hủy bỏ
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md">
                  {isEditing ? 'Lưu Thay Đổi' : 'Tạo Loại Phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}