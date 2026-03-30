import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/env';

export default function AdminUsers() {
  // 1. Khởi tạo mảng rỗng thay vì mock data
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null, full_name: '', email: '', phone: '', role: 'customer', password: ''
  });

  // Lấy Token từ trình duyệt để xác thực quyền Admin
  const token = localStorage.getItem('userToken');

  // Tự động gọi API khi vừa mở trang
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!mounted) return;
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data); // Gán dữ liệu thật vào state
        }
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      }
    };

    fetchUsers();
    return () => { mounted = false; };
  }, [token]);

  // Xử lý mở Modal
  const openModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setFormData({ ...user, password: '' });
    } else {
      setIsEditing(false);
      setFormData({ id: null, full_name: '', email: '', phone: '', role: 'customer', password: '' });
    }
    setIsModalOpen(true);
  };

  // 3. HÀM LƯU (THÊM / SỬA) TÀI KHOẢN LÊN BACKEND
  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${API_BASE_URL}/api/users/${formData.id}` : `${API_BASE_URL}/api/users`;
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
        alert(isEditing ? "Cập nhật thành công!" : "Tạo tài khoản thành công!");
        setIsModalOpen(false);
        try {
          const reload = await fetch(`${API_BASE_URL}/api/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (reload.ok) {
            const data = await reload.json();
            setUsers(data.data);
          }
        } catch (error) {
          console.error("Lỗi tải danh sách:", error);
        }
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Vui lòng kiểm tra lại thông tin"));
      }
    } catch (error) {
      console.error("Lỗi lưu tài khoản:", error);
    }
  };

  // 4. HÀM XÓA TÀI KHOẢN
  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      alert("Không thể xóa tài khoản Admin gốc từ giao diện này!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          try {
            const reload = await fetch(`${API_BASE_URL}/api/users`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });
            if (reload.ok) {
              const data = await reload.json();
              setUsers(data.data);
            }
          } catch (error) {
            console.error("Lỗi tải danh sách:", error);
          }
        }
      } catch (error) {
        console.error("Lỗi xóa tài khoản:", error);
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Quản Trị Viên</span>;
      case 'staff': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Nhân Viên</span>;
      case 'customer': return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Khách Hàng</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Tài Khoản</h1>
            <p className="text-gray-500 text-sm mt-1">Phân quyền nhân viên và quản lý danh sách khách hàng</p>
          </div>
          <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md flex items-center gap-2">
            <span className="text-xl">+</span> Cấp Tài Khoản Mới
          </button>
        </div>

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Họ và Tên</th>
                <th className="p-4 font-semibold text-gray-600">Liên Hệ</th>
                <th className="p-4 font-semibold text-gray-600">Vai Trò</th>
                <th className="p-4 font-semibold text-gray-600">Ngày Tạo</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500 font-medium">#{user.id}</td>
                  <td className="p-4 font-bold text-gray-800">{user.full_name}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-indigo-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                  </td>
                  <td className="p-4">{getRoleBadge(user.role)}</td>
                  {/* Format lại ngày tháng từ Laravel */}
                  <td className="p-4 text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded">Sửa</button>
                    <button onClick={() => handleDelete(user.id, user.role)} className="text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
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
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Cập Nhật Tài Khoản' : '✨ Tạo Tài Khoản'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input type="text" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none">
                    <option value="customer">Khách hàng</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEditing ? 'Mật khẩu mới' : 'Mật khẩu *'}</label>
                  <input type="password" required={!isEditing} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder={isEditing ? "Để trống nếu giữ nguyên" : "Nhập mật khẩu"}/>
                </div>
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