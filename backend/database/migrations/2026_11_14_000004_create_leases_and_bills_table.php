<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('lease_code', 30)->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('rent_amount', 14, 2);
            $table->string('billing_frequency', 20)->default('MONTHLY');
            $table->smallInteger('billing_due_day')->default(1);
            $table->decimal('deposit_required', 14, 2)->default(0);
            $table->enum('status', ['DRAFT', 'ACTIVE', 'ENDED', 'TERMINATED'])->default('ACTIVE');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['room_id', 'start_date', 'end_date', 'status']);
        });

        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained('leases')->cascadeOnDelete();
            $table->string('bill_number', 32)->unique();
            $table->string('bill_type', 24)->default('RENT');
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('total_amount', 14, 2);
            $table->decimal('paid_amount', 14, 2)->default(0);
            $table->date('due_date');
            $table->enum('status', ['UNPAID', 'PARTIAL', 'PAID', 'VOID'])->default('UNPAID');
            $table->string('idempotency_key', 100)->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bills');
        Schema::dropIfExists('leases');
    }
};
