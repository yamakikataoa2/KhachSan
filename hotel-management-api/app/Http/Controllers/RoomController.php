<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room; // Phải gọi Model Room vào đây

class RoomController extends Controller
{
    public function index()
    {
        // Hàm with('roomType') sẽ tự động JOIN bảng rooms với room_types
        // để lấy ra tên, giá tiền, sức chứa cho từng phòng.
        $rooms = Room::with('roomType')->get();

        return response()->json([
            'message' => 'Lấy danh sách phòng thành công',
            'data' => $rooms
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Kiểm tra quyền (Chỉ admin hoặc staff mới được thêm)
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'staff') {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện chức năng này!'
            ], 403);
        }

        // 2. Kiểm tra dữ liệu gửi lên
        $request->validate([
            'room_number' => 'required|string|unique:rooms,room_number', // Số phòng không được trùng
            'room_type_id' => 'required|exists:room_types,id', // Loại phòng phải tồn tại
            'status' => 'nullable|string|in:Available,Occupied,Maintenance' // Chỉ nhận 3 trạng thái này
        ]);

        // 3. Tạo phòng mới
        $room = Room::create([
            'room_number' => $request->room_number,
            'room_type_id' => $request->room_type_id,
            'status' => $request->status ?? 'Available' // Mặc định là phòng trống
        ]);

        // 4. Trả về kết quả
        return response()->json([
            'message' => 'Thêm phòng mới thành công!',
            'data' => $room
        ], 201);
    }

    // API SỬA THÔNG TIN PHÒNG
    public function update(Request $request, $id)
    {
        // 1. Phân quyền (Chỉ admin hoặc staff)
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'staff') {
            return response()->json(['message' => 'Bạn không có quyền thực hiện chức năng này!'], 403);
        }

        // 2. Tìm phòng cần sửa
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng này!'], 404);
        }

        // 3. Validate dữ liệu
        $request->validate([
            // unique:rooms,room_number,$id -> Cho phép giữ nguyên số phòng cũ, nhưng nếu đổi thì không được trùng với phòng khác
            'room_number' => 'sometimes|required|string|unique:rooms,room_number,' . $id,
            'room_type_id' => 'sometimes|required|exists:room_types,id',
            'status' => 'sometimes|required|string|in:Available,Occupied,Maintenance'
        ]);

        // 4. Cập nhật
        $room->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thông tin phòng thành công!',
            'data' => $room
        ], 200);
    }

    // API XÓA PHÒNG
    public function destroy(Request $request, $id)
    {
        // 1. Phân quyền (Nghiêm ngặt: Chỉ Admin mới được quyền xóa phòng)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Chỉ Quản trị viên mới được phép xóa phòng!'], 403);
        }

        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng này!'], 404);
        }

        // 2. Kiểm tra logic: Không cho phép xóa nếu phòng đang có khách (Occupied)
        if ($room->status === 'Occupied') {
            return response()->json(['message' => 'Không thể xóa! Phòng này hiện đang có khách ở.'], 400);
        }

        // 3. Xóa phòng
        $room->delete();

        return response()->json(['message' => 'Xóa phòng thành công!'], 200);
    }
}