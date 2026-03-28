<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RoomType; // Nhớ gọi Model này vào

class RoomTypeController extends Controller
{
    public function store(Request $request)
    {
        // 1. Kiểm tra quyền (Chỉ admin hoặc staff mới được thêm)
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'staff') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này!'
            ], 403); // 403 Forbidden
        }

        // 2. Validate dữ liệu gửi lên
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'max_occupancy' => 'required|integer|min:1'
        ]);

        // 3. Lưu vào Database
        $roomType = RoomType::create([
            'name' => $request->name,
            'description' => $request->description,
            'base_price' => $request->base_price,
            'max_occupancy' => $request->max_occupancy
        ]);

        // 4. Trả về kết quả
        return response()->json([
            'message' => 'Thêm Loại phòng mới thành công!',
            'data' => $roomType
        ], 201);
    }
}