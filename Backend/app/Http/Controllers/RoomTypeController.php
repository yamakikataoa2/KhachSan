<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    // Lấy danh sách Loại phòng
    public function index()
    {
        return response()->json([
            'data' => RoomType::orderBy('id', 'desc')->get()
        ], 200);
    }

    // Thêm Loại phòng mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:room_types,name',
            'base_price' => 'required|numeric|min:0',
            'max_occupancy' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200'
        ]);

        $data = $request->all();

        // Xử lý upload ảnh
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('room_types', 'public');
            $data['image'] = $imagePath;
        }

        $roomType = RoomType::create($data);

        return response()->json(['message' => 'Thêm loại phòng thành công', 'data' => $roomType], 201);
    }

    // Cập nhật Loại phòng
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        // Thêm validation rules - chỉ validate những field có trong request
        $rules = [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200'
        ];
        
        if ($request->has('name')) {
            $rules['name'] = 'required|string|unique:room_types,name,' . $id;
        }
        if ($request->has('base_price')) {
            $rules['base_price'] = 'required|numeric|min:0';
        }
        if ($request->has('max_occupancy')) {
            $rules['max_occupancy'] = 'required|integer|min:1';
        }
        if ($request->has('description')) {
            $rules['description'] = 'nullable|string';
        }

        $request->validate($rules);

        $data = $request->all();
        // Loại bỏ _method - không cần lưu vào database
        if (isset($data['_method'])) {
            unset($data['_method']);
        }

        // Xử lý upload ảnh mới
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($roomType->image && Storage::disk('public')->exists($roomType->image)) {
                Storage::disk('public')->delete($roomType->image);
            }
            $imagePath = $request->file('image')->store('room_types', 'public');
            $data['image'] = $imagePath;
        }

        $roomType->update($data);

        return response()->json(['message' => 'Cập nhật thành công', 'data' => $roomType]);
    }

    // Xóa Loại phòng
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);
        
        // Kiểm tra xem có phòng nào đang dùng loại này không (nếu có thì không cho xóa)
        if ($roomType->rooms()->count() > 0) {
            return response()->json(['message' => 'Không thể xóa vì đang có phòng thuộc loại này!'], 400);
        }

        // Xóa ảnh nếu có
        if ($roomType->image && Storage::disk('public')->exists($roomType->image)) {
            Storage::disk('public')->delete($roomType->image);
        }

        $roomType->delete();
        return response()->json(['message' => 'Xóa loại phòng thành công']);
    }
}