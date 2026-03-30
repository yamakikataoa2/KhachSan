<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon; // 👈 Thư viện xử lý ngày tháng siêu mạnh của Laravel

class BookingController extends Controller
{
    // 1. Lấy danh sách toàn bộ đơn đặt phòng cho Admin
    public function index()
    {
        // with('room') để lấy kèm theo thông tin số phòng
        $bookings = Booking::with('room')->orderBy('id', 'desc')->get();
        return response()->json(['data' => $bookings]);
    }

    // 2. Admin cập nhật trạng thái đơn (Duyệt đơn)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json(['message' => 'Cập nhật trạng thái thành công!', 'data' => $booking]);
    }
    
    // ... (Giữ nguyên hàm public function store() ở dưới nhé)
    // API Xử lý Đặt phòng mới
    public function store(Request $request)
    {
        // 1. Xác thực dữ liệu gửi lên
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'note' => 'nullable|string'
        ]);

        // 2. Tính toán số ngày lưu trú
        $checkIn = Carbon::parse($request->check_in_date);
        $checkOut = Carbon::parse($request->check_out_date);
        $days = $checkIn->diffInDays($checkOut); 
        
        // Nếu khách check-in và check-out cùng ngày, tính tròn 1 ngày
        if ($days == 0) $days = 1; 

        // 3. Lấy thông tin Phòng để tính Tổng tiền
        $room = Room::with('roomType')->findOrFail($request->room_id);
        $totalPrice = $room->roomType->base_price * $days;

        // 4. Lưu đơn Đặt phòng vào Database
        $booking = Booking::create([
            'user_id' => $request->user()->id, // ID của khách hàng đang đăng nhập
            'room_id' => $request->room_id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'total_price' => $totalPrice,
            'status' => 'Pending', // Trạng thái: Đang chờ duyệt
            'note' => $request->note,
        ]);

        return response()->json([
            'message' => 'Đặt phòng thành công!',
            'data' => $booking
        ], 201);
    }
}