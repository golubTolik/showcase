<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute_value extends Model
{
    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    public function product_attribute_values()
    {
        return $this->hasMany(Product_attribute_value::class);
    }
}
