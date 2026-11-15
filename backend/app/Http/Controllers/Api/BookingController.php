<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Booking;
use App\Models\Room;

class BookingController extends Controller
{
    /**
     * Public booking creation with DB transaction locking to prevent race condition.
     */
    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'applicant_name' => 'required|string|max:150',
            'applicant_phone' => 'required|string|max:30',
            'applicant_email' => 'nullable|email|max:190',
            'planned_start_date' => 'required|date|after_or_equal:today',
            'duration_months' => 'required|integer|min:1',
            'occupant_count' => 'required|integer|min:1|max:2',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            // Lock room row FOR UPDATE
            $room = Room::where('id', $validated['room_id'])->lockForUpdate()->firstOrFail();

            if ($room->operational_status !== 'ACTIVE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Kamar ini sedang dalam masa perbaikan (maintenance) dan belum dapat dibooking.'
                ], 422);
            }

            // Check if room has active conflict
            $conflict = Booking::where('room_id', $room->id)
                ->whereIn('status', ['APPROVED', 'CONFIRMED'])
                ->where('planned_start_date', '<=', $validated['planned_start_date'])
                ->exists();

            if ($conflict) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mohon maaf, kamar ini baru saja dipesan oleh pemohon lain pada rentang tanggal tersebut.'
                ], 409);
            }

            $booking = Booking::create([
                'room_id' => $room->id,
                'booking_code' => Booking::generateUniqueBookingCode(),
                'applicant_name' => $validated['applicant_name'],
                'applicant_phone' => $validated['applicant_phone'],
                'applicant_email' => $validated['applicant_email'] ?? null,
                'planned_start_date' => $validated['planned_start_date'],
                'duration_months' => $validated['duration_months'],
                'occupant_count' => $validated['occupant_count'],
                'status' => 'PENDING',
                'admin_note' => $validated['notes'] ?? null
            ]);

            return response()->json([
                'success' => true,
                'data' => $booking,
                'message' => 'Pengajuan booking Anda berhasil terkirim. Simpan kode booking Anda.'
            ], 201);
        });
    }

    public function checkStatus(string $code)
    {
        $booking = Booking::with('room')->where('booking_code', strtoupper($code))->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Kode booking tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'booking_code' => $booking->booking_code,
                'applicant_name' => $booking->applicant_name,
                'room_code' => $booking->room->room_code ?? '-',
                'planned_start_date' => $booking->planned_start_date->toDateString(),
                'duration_months' => $booking->duration_months,
                'occupant_count' => $booking->occupant_count,
                'status' => $booking->status,
                'admin_note' => $booking->admin_note,
                'created_at' => $booking->created_at->toDateTimeString()
            ]
        ]);
    }

    public function index()
    {
        $bookings = Booking::with('room')->latest()->get();
        return response()->json(['success' => true, 'data' => $bookings]);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $request->validate(['status' => 'required|in:PENDING,APPROVED,AWAITING_DP,CONFIRMED,REJECTED,CANCELLED']);
        
        $booking->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note ?? $booking->admin_note
        ]);

        return response()->json(['success' => true, 'data' => $booking, 'message' => 'Status booking berhasil diperbarui.']);
    }
}
