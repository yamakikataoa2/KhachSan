<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $timestamps = false; // Tắt tự động thêm thời gian nếu database không có

    protected $fillable = ['booking_id', 'payment_method', 'amount', 'payment_date'];
}