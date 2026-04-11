<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\PageController;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Models\Category;
// use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::inertia('/', 'index', ['categories'=>Category::all()])->name('index');
// Route::inertia('/catalog', 'catalog', [
//     'categories'=> Category::all(),
//     'products' => Product::with(['images' => fn($q) => $q->orderBy('sort_order'), 'product_attribute_values.attribute_value.attribute'])->get(),
// ])->name('catalog');
Route::get('/catalog', [PageController::class, 'catalog'])->name('catalog');
Route::get('/products/show/{product}', [ProductController::class, 'show'])->name('products.show');

Route::post('/cart', [CartController::class, 'store'])->name('cart.store');

Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/registration', [UserController::class, 'registration'])->name('registration');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Route::get('/', function () {
//     return Inertia::render('index', ['showModal' => false]);
// })->name('index');
