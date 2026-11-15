<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    protected $fillable = [
        'room_type_id',
        'room_code',
        'floor',
        'capacity',
        'base_rate',
        'operational_status',
        'description',
        'amenities',
        'photo_url',
        'is_published'
    ];

    protected $casts = [
        'amenities' => 'array',
        'base_rate' => 'decimal:2',
        'floor' => 'integer',
        'capacity' => 'integer',
        'is_published' => 'boolean'
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    /**
     * Okupansi status derived: Kosong, Terisi, Dipesan
     */
    public function getOccupancyStatusAttribute(): string
    {
        if ($this->operational_status === 'MAINTENANCE') {
            return 'MAINTENANCE';
        }

        $now = now()->toDateString();
        $hasActiveLease = $this->leases()
            ->where('status', 'ACTIVE')
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->exists();

        if ($hasActiveLease) {
            return 'TERISI';
        }

        $hasConfirmedBooking = $this->bookings()
            ->whereIn('status', ['APPROVED', 'CONFIRMED'])
            ->where('planned_start_date', '>=', $now)
            ->exists();

        if ($hasConfirmedBooking) {
            return 'DIPESAN';
        }

        return 'KOSONG';
    }
}
