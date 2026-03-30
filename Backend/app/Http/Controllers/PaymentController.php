<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Booking;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Kiểm tra dữ liệu gửi lên
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_method' => 'required|string', // Ví dụ: Cash, Credit Card, Momo...
            'amount' => 'required|numeric|min:0'
        ]);

        $booking = Booking::find($request->booking_id);

        // 2. Kiểm tra xem đơn này đã thanh toán chưa để tránh thanh toán trùng
        if ($booking->status === 'Completed') {
            return response()->json(['message' => 'Đơn đặt phòng này đã được thanh toán từ trước!'], 400);
        }

        // 3. Tạo lịch sử giao dịch thanh toán
        $payment = Payment::create([
            'booking_id' => $request->booking_id,
            'payment_method' => $request->payment_method,
            'amount' => $request->amount,
            'payment_date' => Carbon::now()
        ]);

        // 4. Đổi trạng thái Booking thành "Completed" (Đã hoàn thành)
        $booking->update(['status' => 'Completed']);

        return response()->json([
            'message' => 'Thanh toán thành công! Đơn đặt phòng đã được hoàn tất.',
            'data' => $payment
        ], 201);
    }
}