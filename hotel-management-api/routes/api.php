<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;

// --- NHÓM API CÔNG KHAI (Không cần Token) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms', [RoomController::class, 'index']); // Xem danh sách phòng

// --- NHÓM API BẢO MẬT (Bắt buộc có Token) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // API mặc định lấy thông tin user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // API Khách hàng
    Route::post('/bookings', [BookingController::class, 'store']); // Đặt phòng
    Route::get('/bookings', [BookingController::class, 'index']);  // Lịch sử đặt phòng
    
    // API Thanh toán
    Route::post('/payments', [PaymentController::class, 'store']); // API Thanh toán
    
    // API Quản lý / Admin
    Route::post('/room-types', [RoomTypeController::class, 'store']); // Thêm Loại phòng
    Route::post('/rooms', [RoomController::class, 'store']);          // Thêm Phòng mới
    Route::put('/rooms/{id}', [RoomController::class, 'update']);    // API Sửa phòng
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']); // API Xóa phòng
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']); // Cập nhật trạng thái đơn
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);        // Xem thống kê doanh thu
});