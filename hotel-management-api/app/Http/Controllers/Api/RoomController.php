<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    public function index()
{
    $rooms = Room::with('roomType')->get(); // Lấy phòng kèm theo thông tin loại phòng
    return response()->json($rooms);
}
}
