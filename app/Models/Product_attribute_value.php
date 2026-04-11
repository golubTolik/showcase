<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product_attribute_value extends Model
{
    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function attribute_value(){
        return $this->belongsTo(Attribute_value::class);
    }
}
