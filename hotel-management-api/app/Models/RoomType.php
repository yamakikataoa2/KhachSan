<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'description', 'base_price', 'max_occupancy'];
}
