<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\PropertySetting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default Admin User
        User::updateOrCreate(
            ['email' => 'shukohh21@gmail.com'],
            [
                'name' => 'Pengelola Kost Shukoh',
                'phone' => '0812-3456-7890',
                'password' => Hash::make('FAFA17052007'),
                'role' => 'ADMIN',
                'status' => 'ACTIVE'
            ]
        );

        // Default Tenant User
        User::updateOrCreate(
            ['email' => 'fajar@gmail.com'],
            [
                'name' => 'Fajar Nugraha',
                'phone' => '0812-9988-7766',
                'password' => Hash::make('password123'),
                'role' => 'TENANT',
                'status' => 'ACTIVE'
            ]
        );
    }
}
