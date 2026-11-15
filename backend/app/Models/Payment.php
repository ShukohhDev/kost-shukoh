<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'bill_id',
        'tenant_id',
        'payment_reference',
        'amount',
        'payment_method',
        'paid_date',
        'proof_file_path',
        'status',
        'verified_by',
        'verified_at',
        'rejection_reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_date' => 'date',
        'verified_at' => 'datetime'
    ];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
