<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    // public function index()
    // {
    //     $showModal = auth()->check ? true : false; // пример логики
    //     return Inertia::render('index', ['showModal' => $showModal]);
    // }
    public function catalog(){
        $categories = Category::all();
        $products = Product::with(['images' => fn($q) => $q->orderBy('sort_order'), 'product_attribute_values.attribute_value.attribute'])->get();

        return Inertia::render('catalog', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
