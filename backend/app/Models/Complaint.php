<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    protected $fillable = [
        'tenant_id',
        'room_id',
        'ticket_code',
        'category',
        'title',
        'description',
        'priority',
        'status',
        'admin_note'
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public static function generateTicketCode(): string
    {
        return 'TKT-' . date('Ym') . '-' . rand(10, 99);
    }
}
