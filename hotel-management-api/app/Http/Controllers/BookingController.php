<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Booking;
use App\Models\BookingDetail;
use Carbon\Carbon;

class BookingController extends Controller
{

    public function index(Request $request)
    {
        // Lấy danh sách đơn đặt phòng của chính User đang sử dụng Token này
        $bookings = Booking::where('user_id', $request->user()->id)->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Lịch sử đặt phòng của bạn',
            'data' => $bookings
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Kiểm tra dữ liệu gửi lên
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        // 2. Kiểm tra xem phòng có trống không
        $room = Room::with('roomType')->find($request->room_id);

        if ($room->status !== 'Available') {
            return response()->json(['message' => 'Phòng này đã có người đặt hoặc đang bảo trì!'], 400);
        }

        // 3. Tính toán số ngày và tổng tiền
        $checkIn = Carbon::parse($request->check_in_date);
        $checkOut = Carbon::parse($request->check_out_date);
        $days = $checkIn->diffInDays($checkOut);
        
        if ($days == 0) $days = 1; // Đặt và trả trong ngày tính là 1 ngày

        $totalPrice = $days * $room->roomType->base_price;

        // 4. Tạo Đơn đặt phòng mới
        $booking = Booking::create([
            'user_id' => $request->user()->id, // Lấy ID của người dùng đang đăng nhập
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'total_price' => $totalPrice,
            'status' => 'Pending'
        ]);

        // 5. Lưu chi tiết phòng vào hóa đơn
        BookingDetail::create([
            'booking_id' => $booking->id,
            'room_id' => $room->id,
            'price_at_booking' => $room->roomType->base_price
        ]);

        // 6. Đổi trạng thái phòng thành Đã có người
        $room->update(['status' => 'Occupied']);

        return response()->json([
            'message' => 'Đặt phòng thành công!',
            'booking' => $booking
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        // 1. Kiểm tra quyền (Chỉ admin hoặc staff)
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'staff') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này!'
            ], 403);
        }

        // 2. Kiểm tra dữ liệu gửi lên
        $request->validate([
            'status' => 'required|string|in:Confirmed,Cancelled,Completed'
        ]);

        // 3. Tìm đơn đặt phòng theo ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy đơn đặt phòng!'], 404);
        }

        // 4. Cập nhật trạng thái
        $booking->update(['status' => $request->status]);

        // (Tùy chọn nâng cao: Nếu hủy phòng, bạn có thể viết thêm code đổi lại trạng thái bảng Room thành Available ở đây)

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn đặt phòng thành công!',
            'data' => $booking
        ], 200);
    }
}