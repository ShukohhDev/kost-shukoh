<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertySetting extends Model
{
    protected $fillable = ['setting_key', 'setting_value'];

    public static function get(string $key, $default = null)
    {
        $setting = self::where('setting_key', $key)->first();
        if (!$setting) return $default;

        $val = $setting->setting_value;
        $decoded = json_decode($val, true);
        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $val;
    }

    public static function set(string $key, $value): void
    {
        $storedValue = is_array($value) ? json_encode($value) : (string)$value;
        self::updateOrCreate(
            ['setting_key' => $key],
            ['setting_value' => $storedValue]
        );
    }
}
