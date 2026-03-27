<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'email',
        'delivery_type',
        'address',
        'payment_method',
        'status',
        'total_price',
        'comment'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(Order_item::class);
    }
}
