<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo tài khoản Admin (Quản trị viên tối cao)
        User::create([
            'full_name' => 'Admin Tổng',
            'email' => 'admin@hotelabc.com',
            'password' => Hash::make('123456'), // Mật khẩu là 123456
            'phone' => '0999888777',
            'role' => 'admin'
        ]);

        // 2. Tạo tài khoản Nhân viên (Lễ tân)
        User::create([
            'full_name' => 'Lễ Tân Ca Sáng',
            'email' => 'letan1@hotelabc.com',
            'password' => Hash::make('123456'),
            'phone' => '0911222333',
            'role' => 'staff'
        ]);
    }
}