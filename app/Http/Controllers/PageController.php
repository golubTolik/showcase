<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')->inRandomOrder()->take(6)->get();
        // Получаем 8 самых популярных товаров (например, по количеству заказов)
        $popularProducts = Product::with('images')
            ->withCount('order_items') // предполагаем, что есть связь orderItems
            ->orderBy('order_items_count', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'old_price' => $product->old_price,
                    'image_url' => $product->images->first()?->image_url,
                ];
            });

        return Inertia::render('index', [
            'categories' => $categories,
            'popularProducts' => $popularProducts,
        ]);
    }
    public function catalog(Request $request){
        $categories = Category::all();
        $products = Product::with(['images' => fn($q) => $q->orderBy('sort_order'), 'product_attribute_values.attribute_value.attribute'])->get();
        $selectedCategoryId = $request->query('category');

        return Inertia::render('catalog', [
            'categories' => $categories,
            'products' => $products,
            'selectedCategoryId' => $selectedCategoryId,
        ]);
    }
}
