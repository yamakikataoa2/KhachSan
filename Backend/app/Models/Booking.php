<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Cho phép lưu các cột này
    protected $fillable = [
        'user_id', 'room_id', 'customer_name', 'customer_phone', 
        'check_in_date', 'check_out_date', 'total_price', 'status', 'note'
    ];

    // Thêm hàm này: Một đơn đặt phòng sẽ THUỘC VỀ một Căn phòng
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'id');
    }
}