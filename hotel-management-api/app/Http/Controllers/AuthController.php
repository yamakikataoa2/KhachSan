<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 1. HÀM ĐĂNG KÝ
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string', // 👈 Phải là full_name
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string',
        ]);

        $user = User::create([
            'full_name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu
            'phone' => $request->phone,
            'role' => 'customer', // Mặc định tài khoản mới là khách hàng
        ]);

        // Tạo Token cho user vừa đăng ký
        $token = $user->createToken('hotel-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // 2. HÀM ĐĂNG NHẬP
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra user có tồn tại và mật khẩu có khớp không
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // Nếu đúng, tạo Token
        $token = $user->createToken('hotel-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => $user,
            'token' => $token
        ]);
    }

    // 3. HÀM ĐĂNG XUẤT (Phải có token mới gọi được)
    public function logout(Request $request)
    {
        // Xóa toàn bộ token của user hiện tại
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}