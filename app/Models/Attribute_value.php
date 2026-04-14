<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute_value extends Model
{
    protected $fillable = ['attribute_id', 'value'];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    public function product_attribute_values()
    {
        return $this->hasMany(Product_attribute_value::class);
    }
}
