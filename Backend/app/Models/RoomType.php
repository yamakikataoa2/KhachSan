<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class RoomType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'base_price', 'max_occupancy', 'image'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        return Storage::disk('public')->url($this->image);
    }

    // Khai báo: Một Loại phòng có thể CÓ NHIỀU phòng
    public function rooms()
    {
        return $this->hasMany(Room::class, 'room_type_id', 'id');
    }
}