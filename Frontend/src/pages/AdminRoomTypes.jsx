import { useState, useEffect } from 'react';

export default function AdminRoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    id: null, name: '', base_price: '', max_occupancy: '', description: '', image: null
  });

  const token = localStorage.getItem('userToken');

  // 1. Tải danh sách Loại Phòng
  const fetchRoomTypes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/room-types', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRoomTypes(data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // 2. Mở Modal
  const openModal = (type = null) => {
    if (type) {
      setIsEditing(true);
      setFormData({ ...type, image: null });
      setImagePreview(type.image ? `http://localhost:8000/storage/${type.image}` : null);
    } else {
      setIsEditing(false);
      setFormData({ id: null, name: '', base_price: '', max_occupancy: '', description: '', image: null });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Lưu dữ liệu (Thêm/Sửa)
  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEditing ? `http://localhost:8000/api/room-types/${formData.id}` : 'http://localhost:8000/api/room-types';
    const method = isEditing ? 'POST' : 'POST'; // Laravel sử dụng POST cho update với _method

    try {
      // Tạo FormData để gửi file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('base_price', formData.base_price);
      data.append('max_occupancy', formData.max_occupancy);
      data.append('description', formData.description);
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }
      if (isEditing) {
        data.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm loại phòng thành công!");
        setIsModalOpen(false);
        fetchRoomTypes();
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Vui lòng kiểm tra lại thông tin"));
      }
    } catch (error) {
      console.error("Lỗi lưu:", error);
      alert("Lỗi kết nối, vui lòng thử lại!");
    }
  };

  // 5. Xóa Loại Phòng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/room-types/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchRoomTypes();
        } else {
          const errorData = await response.json();
          alert("Lỗi: " + errorData.message);
        }
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Loại Phòng</h1>
            <p className="text-gray-500 text-sm mt-1">Thiết lập cấu hình, giá cả và sức chứa cho các hạng phòng</p>
          </div>
          <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md flex items-center gap-2">
            <span className="text-xl">+</span> Thêm Loại Phòng
          </button>
        </div>

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 w-20">Ảnh</th>
                <th className="p-4 font-semibold text-gray-600 w-1/5">Tên Hạng Phòng</th>
                <th className="p-4 font-semibold text-gray-600 w-1/5">Giá Cơ Bản</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Sức Chứa</th>
                <th className="p-4 font-semibold text-gray-600 w-1/4">Mô Tả</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((type) => (
                <tr key={type.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4">
                    {type.image ? (
                      <img src={`http://localhost:8000/storage/${type.image}`} alt={type.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">📸</div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-gray-800">{type.name}</td>
                  <td className="p-4 text-indigo-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.base_price)}
                  </td>
                  <td className="p-4 text-center font-medium text-gray-700">{type.max_occupancy}</td>
                  <td className="p-4 text-sm text-gray-500 line-clamp-1">{type.description || 'Chưa có'}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openModal(type)} className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded">Sửa</button>
                      <button onClick={() => handleDelete(type.id)} className="text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {roomTypes.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có loại phòng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Cập Nhật Loại Phòng' : '✨ Thêm Loại Phòng Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Loại Phòng</label>
                <div className="flex flex-col items-center gap-3">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-indigo-300" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-lg cursor-pointer hover:border-indigo-400" />
                  <p className="text-xs text-gray-500 text-center">Chỉ cho phép: PNG, JPG, GIF. Kích thước tối đa: 50MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Hạng Phòng *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="VD: Phòng VIP, Tiêu Chuẩn..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá Cơ Bản (VNĐ) *</label>
                  <input type="number" required min="0" value={formData.base_price} onChange={(e) => setFormData({...formData, base_price: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="VD: 500000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sức Chứa Tối Đa *</label>
                  <input type="number" required min="1" value={formData.max_occupancy} onChange={(e) => setFormData({...formData, max_occupancy: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Số người" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả Chi Tiết</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none" placeholder="Mô tả về tiện ích, view phòng..."></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4 sticky bottom-0 bg-white">
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