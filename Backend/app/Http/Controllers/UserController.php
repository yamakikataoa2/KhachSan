<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Lấy danh sách tài khoản
    public function index()
    {
        return response()->json(['data' => User::orderBy('id', 'desc')->get()]);
    }

    // Thêm tài khoản mới
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|string',
            'role' => 'required|in:admin,staff,customer'
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'Tạo thành công', 'data' => $user]);
    }

    // Cập nhật tài khoản
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->full_name = $request->full_name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->role = $request->role;

        // Nếu có nhập mật khẩu mới thì mới cập nhật
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();
        return response()->json(['message' => 'Cập nhật thành công']);
    }

    // Xóa tài khoản
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Không thể xóa tài khoản admin'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Xóa thành công']);
    }
}