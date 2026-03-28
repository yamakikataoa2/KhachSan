<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Hàm Đăng ký tài khoản mới
    public function register(Request $request)
    {
        $fields = $request->validate([
    'full_name' => 'required|string', // Đổi từ name
    'email' => 'required|string|unique:users,email',
    'password' => 'required|string|confirmed',
    'phone' => 'nullable|string', // Thêm mới
    'role' => 'nullable|string|in:admin,staff,customer' // Thêm mới
]);

        $user = User::create([
    'full_name' => $fields['full_name'],
    'email' => $fields['email'],
    'password' => bcrypt($fields['password']),
    'phone' => $fields['phone'] ?? null,
    'role' => $fields['role'] ?? 'customer',
]);

        $token = $user->createToken('hoteltoken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // Hàm Đăng nhập
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        // Kiểm tra email
        $user = User::where('email', $fields['email'])->first();

        // Kiểm tra password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Thông tin đăng nhập không chính xác'], 401);
        }

        $token = $user->createToken('hoteltoken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 200);
    }
}