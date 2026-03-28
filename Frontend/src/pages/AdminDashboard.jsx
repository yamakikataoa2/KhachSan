import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // 1. Dữ liệu Thống kê tổng quan (Mock data)
  const stats = [
    { id: 1, title: "Tổng Doanh Thu", value: "124.500.000 đ", trend: "+12.5%", isUp: true, icon: "💰", color: "text-green-600", bg: "bg-green-100" },
    { id: 2, title: "Đơn Đặt Tháng Này", value: "156", trend: "+5.2%", isUp: true, icon: "📅", color: "text-blue-600", bg: "bg-blue-100" },
    { id: 3, title: "Tỷ Lệ Lấp Đầy", value: "78%", trend: "+2.1%", isUp: true, icon: "🏨", color: "text-indigo-600", bg: "bg-indigo-100" },
    { id: 4, title: "Khách Hàng Mới", value: "42", trend: "-1.5%", isUp: false, icon: "👥", color: "text-orange-600", bg: "bg-orange-100" },
  ];

  // 2. Dữ liệu Biểu đồ doanh thu 6 tháng gần nhất (Tính theo % chiều cao)
  const revenueChart = [
    { month: "Tháng 8", percentage: 40, amount: "45M" },
    { month: "Tháng 9", percentage: 55, amount: "62M" },
    { month: "Tháng 10", percentage: 35, amount: "38M" },
    { month: "Tháng 11", percentage: 70, amount: "78M" },
    { month: "Tháng 12", percentage: 95, amount: "110M" },
    { month: "Tháng 1", percentage: 80, amount: "92M" },
  ];

  // 3. Dữ liệu Đơn đặt phòng mới nhất
  const recentBookings = [
    { id: "BK0921", guest: "Nguyễn Văn A", room: "Phòng VIP", date: "15/01/2026", status: "Confirmed", amount: "2.400.000 đ" },
    { id: "BK0922", guest: "Trần Thị B", room: "Phòng Tiêu Chuẩn", date: "15/01/2026", status: "Pending", amount: "500.000 đ" },
    { id: "BK0923", guest: "Lê Hoàng C", room: "Phòng Gia Đình", date: "14/01/2026", status: "Confirmed", amount: "1.600.000 đ" },
    { id: "BK0924", guest: "Phạm D", room: "Suite Tổng Thống", date: "14/01/2026", status: "Cancelled", amount: "5.000.000 đ" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng Quan Báo Cáo</h1>
            <p className="text-gray-500 text-sm mt-1">Cập nhật lần cuối: Hôm nay lúc 08:30 AM</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
              📥 Xuất Báo Cáo
            </button>
          </div>
        </div>

        {/* 1. Thẻ Thống Kê (Stat Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                <p className={`text-sm mt-1 font-medium flex items-center gap-1 ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.isUp ? '↗' : '↘'} {stat.trend} <span className="text-gray-400 font-normal ml-1">so với tháng trước</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Biểu đồ doanh thu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Biểu Đồ Doanh Thu</h2>
              <select className="border-none text-sm font-medium text-gray-500 bg-gray-50 py-1 px-3 rounded-md cursor-pointer outline-none">
                <option>6 tháng gần nhất</option>
                <option>Năm nay</option>
              </select>
            </div>
            
            {/* Vẽ biểu đồ bằng Tailwind CSS */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6">
              {revenueChart.map((col, index) => (
                <div key={index} className="flex flex-col items-center w-full group">
                  {/* Tooltip hiển thị số tiền khi hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded mb-2 whitespace-nowrap">
                    {col.amount}
                  </div>
                  {/* Cột biểu đồ */}
                  <div className="w-full bg-indigo-100 rounded-t-md relative flex items-end justify-center h-full">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-md transition-all duration-1000 ease-out group-hover:bg-indigo-600"
                      style={{ height: `${col.percentage}%` }}
                    ></div>
                  </div>
                  {/* Tên tháng */}
                  <span className="text-xs text-gray-500 mt-3 font-medium">{col.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Danh sách Đơn đặt phòng mới nhất */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Đơn Đặt Mới Nhất</h2>
              <Link to="/admin/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Xem tất cả</Link>
            </div>
            
            <div className="space-y-5">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-gray-900">{booking.guest}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.room} • {booking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{booking.amount}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}