<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('full_name', 150);
            $table->string('phone', 30);
            $table->string('email', 190)->nullable();
            $table->string('emergency_name', 150)->nullable();
            $table->string('emergency_phone', 30)->nullable();
            $table->string('id_card_number', 50)->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'PROSPECT'])->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->string('booking_code', 24)->unique();
            $table->string('applicant_name', 150);
            $table->string('applicant_phone', 30);
            $table->string('applicant_email', 190)->nullable();
            $table->date('planned_start_date');
            $table->smallInteger('duration_months')->default(1);
            $table->smallInteger('occupant_count')->default(1);
            $table->enum('status', [
                'PENDING', 'APPROVED', 'AWAITING_DP', 'CONFIRMED', 
                'REJECTED', 'CANCELLED', 'CONVERTED'
            ])->default('PENDING');
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index(['room_id', 'planned_start_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('tenants');
    }
};
