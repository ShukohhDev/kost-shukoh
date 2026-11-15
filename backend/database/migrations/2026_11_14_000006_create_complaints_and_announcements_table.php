<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->string('ticket_code', 24)->unique();
            $table->string('category', 40);
            $table->string('title', 140);
            $table->text('description');
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH'])->default('NORMAL');
            $table->enum('status', ['NEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])->default('NEW');
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title', 160);
            $table->text('content');
            $table->enum('target_audience', ['ALL', 'ACTIVE_TENANTS'])->default('ACTIVE_TENANTS');
            $table->boolean('is_published')->default(true);
            $table->date('published_at');
            $table->timestamps();
        });

        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->string('category', 40);
            $table->string('title', 140);
            $table->text('text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rules');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('complaints');
    }
};
