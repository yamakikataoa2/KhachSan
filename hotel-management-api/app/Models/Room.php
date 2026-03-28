<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    // Bắt buộc phải có chữ 'status' ở đây thì Laravel mới cho phép lưu!
    protected $fillable = ['room_number', 'room_type_id', 'status'];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'id');
    }
}