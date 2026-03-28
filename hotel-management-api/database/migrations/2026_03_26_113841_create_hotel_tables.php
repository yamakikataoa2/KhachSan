<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    // 1. Bảng Loại phòng [cite: 1]
    Schema::create('room_types', function (Blueprint $table) {
        $table->id();
        $table->string('name', 100);
        $table->text('description')->nullable();
        $table->decimal('base_price', 15, 2);
        $table->integer('max_occupancy');
        $table->timestamps();
    });

    // 2. Bảng Phòng [cite: 2]
    Schema::create('rooms', function (Blueprint $table) {
        $table->id();
        $table->string('room_number', 10)->unique();
        $table->foreignId('room_type_id')->constrained('room_types');
        $table->enum('status', ['Available', 'Occupied', 'Cleaning', 'Maintenance'])->default('Available');
        $table->timestamps();
    });

    // 3. Bảng Đặt phòng [cite: 4]
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users');
        $table->date('check_in_date');
        $table->date('check_out_date');
        $table->decimal('total_price', 15, 2)->default(0);
        $table->enum('status', ['Pending', 'Confirmed', 'Cancelled', 'Completed'])->default('Pending');
        $table->timestamps();
    });

    // 4. Chi tiết đặt phòng [cite: 5]
    Schema::create('booking_details', function (Blueprint $table) {
        $table->id();
        $table->foreignId('booking_id')->constrained('bookings');
        $table->foreignId('room_id')->constrained('rooms');
        $table->decimal('price_at_booking', 15, 2);
    });

    // 5. Bảng Thanh toán [cite: 6]
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('booking_id')->constrained('bookings');
        $table->enum('payment_method', ['Cash', 'Credit Card', 'Bank Transfer']);
        $table->decimal('amount', 15, 2);
        $table->timestamp('payment_date')->useCurrent();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_tables');
    }
};
