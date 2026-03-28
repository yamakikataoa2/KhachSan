<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomType;
use App\Models\Room;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $vip = RoomType::create([
            'name' => 'Phòng VIP',
            'description' => 'Phòng sang trọng, view biển',
            'base_price' => 1000000,
            'max_occupancy' => 2
        ]);

        $standard = RoomType::create([
            'name' => 'Phòng Tiêu chuẩn',
            'description' => 'Phòng đầy đủ tiện nghi cơ bản',
            'base_price' => 500000,
            'max_occupancy' => 2
        ]);

        Room::create([
            'room_number' => '101',
            'room_type_id' => $vip->id,
            'status' => 'Available'
        ]);

        Room::create([
            'room_number' => '201',
            'room_type_id' => $standard->id,
            'status' => 'Available'
        ]);
    }
}