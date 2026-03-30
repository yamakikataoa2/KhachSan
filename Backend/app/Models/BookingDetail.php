<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingDetail extends Model
{
    // Bảng này hoàn toàn không có created_at và updated_at
    public $timestamps = false; 

    protected $fillable = ['booking_id', 'room_id', 'price_at_booking'];
}
