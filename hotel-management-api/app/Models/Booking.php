<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    // Báo cho Laravel biết bảng này không có cột updated_at
    const UPDATED_AT = null; 

    protected $fillable = ['user_id', 'check_in_date', 'check_out_date', 'total_price', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
