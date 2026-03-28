<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        // 1. Kiểm tra quyền (Chỉ Admin mới được xem thống kê tiền bạc)
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Bạn không có quyền xem bảng thống kê!'
            ], 403);
        }

        // 2. Tính tổng doanh thu (chỉ tính những đơn đã Confirmed hoặc Completed)
        $totalRevenue = Booking::whereIn('status', ['Confirmed', 'Completed'])->sum('total_price');

        // 3. Đếm tổng số lượng đơn đặt phòng đã tạo
        $totalBookings = Booking::count();

        // 4. Đếm số lượng phòng hiện đang trống
        $availableRooms = Room::where('status', 'Available')->count();

        // 5. Trả về kết quả
        return response()->json([
            'message' => 'Thống kê tổng quan khách sạn',
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_bookings' => $totalBookings,
                'available_rooms' => $availableRooms
            ]
        ], 200);
    }
}