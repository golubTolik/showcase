<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Product_image::class);
    }

    public function product_attribute_values()
    {
        return $this->hasMany(Product_attribute_value::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function usersWhoFavorited()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function cart_items()
    {
        return $this->hasMany(Cart_item::class);
    }

    public function order_items()
    {
        return $this->hasMany(Order_item::class);
    }
}
