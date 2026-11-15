<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'room_id',
        'booking_code',
        'applicant_name',
        'applicant_phone',
        'applicant_email',
        'planned_start_date',
        'duration_months',
        'occupant_count',
        'status',
        'admin_note'
    ];

    protected $casts = [
        'planned_start_date' => 'date',
        'duration_months' => 'integer',
        'occupant_count' => 'integer'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public static function generateUniqueBookingCode(): string
    {
        do {
            $code = 'BSHK-' . rand(1000, 9999);
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }
}
