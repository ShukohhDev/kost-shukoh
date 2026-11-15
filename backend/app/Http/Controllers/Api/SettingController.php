<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertySetting;

class SettingController extends Controller
{
    public function index()
    {
        $settings = PropertySetting::all()->pluck('setting_value', 'setting_key');
        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function indexPublic()
    {
        $keys = ['kost_name', 'address', 'contact_phone', 'contact_email', 'utility_scheme'];
        $settings = PropertySetting::whereIn('setting_key', $keys)->pluck('setting_value', 'setting_key');
        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function update(Request $request)
    {
        foreach ($request->all() as $key => $val) {
            PropertySetting::set($key, $val);
        }

        return response()->json(['success' => true, 'message' => 'Pengaturan operasional berhasil diperbarui.']);
    }
}
