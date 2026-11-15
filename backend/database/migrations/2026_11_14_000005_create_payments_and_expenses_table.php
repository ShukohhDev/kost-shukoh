<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained('bills')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('payment_reference', 40)->unique();
            $table->decimal('amount', 14, 2);
            $table->string('payment_method', 24)->default('TRANSFER');
            $table->date('paid_date');
            $table->string('proof_file_path')->nullable();
            $table->enum('status', ['PENDING', 'VERIFIED', 'REJECTED', 'REVERSED'])->default('PENDING');
            $table->string('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('category', 40);
            $table->string('description', 200);
            $table->decimal('amount', 14, 2);
            $table->date('expense_date');
            $table->string('created_by')->default('Admin');
            $table->timestamps();
        });

        Schema::create('deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained('leases')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->enum('type', ['RECEIVED', 'DEDUCTION', 'REFUND']);
            $table->decimal('amount', 14, 2);
            $table->text('reason')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deposits');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('payments');
    }
};
