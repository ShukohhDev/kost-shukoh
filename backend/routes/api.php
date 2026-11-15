<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes - Kost Shukoh Management System
|--------------------------------------------------------------------------
*/

// Public Endpoints
Route::prefix('public')->group(function () {
    Route::get('/rooms', [RoomController::class, 'indexPublic']);
    Route::get('/rooms/{id}', [RoomController::class, 'showPublic']);
    Route::post('/bookings', [BookingController::class, 'storePublic']);
    Route::get('/bookings/status/{code}', [BookingController::class, 'checkStatus']);
    Route::get('/facilities', [RoomController::class, 'facilities']);
    Route::get('/rules', [RoomController::class, 'rules']);
    Route::get('/settings', [SettingController::class, 'indexPublic']);
});

// Authentication
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Admin Only
    Route::middleware('role:ADMIN')->group(function () {
        Route::apiResource('rooms', RoomController::class);
        Route::get('bookings', [BookingController::class, 'index']);
        Route::post('bookings/{id}/status', [BookingController::class, 'updateStatus']);
        Route::post('bookings/{id}/convert', [BookingController::class, 'convertToLease']);
        Route::post('payments/{id}/verify', [PaymentController::class, 'verify']);
        Route::apiResource('expenses', ExpenseController::class);
        Route::put('settings', [SettingController::class, 'update']);
    });

    // Shared Tenant & Admin
    Route::get('bills', [BillController::class, 'index']);
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('complaints', [ComplaintController::class, 'index']);
    Route::post('complaints', [ComplaintController::class, 'store']);
    Route::post('complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    Route::get('announcements', [ComplaintController::class, 'announcements']);
    Route::get('settings', [SettingController::class, 'index']);
});
