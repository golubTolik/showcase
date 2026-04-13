<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $fullProduct = $product->load(['images', 'product_attribute_values.attribute_value.attribute']);
        // Получаем ID избранных товаров текущего пользователя (если авторизован)
        $favoriteProductIds = [];
        if (Auth::check()) {
            $favoriteProductIds = Auth::user()->favorites()->pluck('product_id')->toArray();
        }

        return Inertia::render('Products/show', [
            'product' => $fullProduct,
            'favoriteProductIds' => $favoriteProductIds, // отдельный пропс
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
