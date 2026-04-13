<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
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

// Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add', [CartController::class, 'store'])->name('store');
    Route::patch('/item/{cartItem}', [CartController::class, 'update'])->name('update');
    Route::delete('/item/{cartItem}', [CartController::class, 'destroy'])->name('destroy');
});
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::middleware('auth')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites', [FavoriteController::class, 'store'])->name('favorites.store');
    Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');
    Route::delete('/favorites/product/{product}', [FavoriteController::class, 'destroyByProduct'])->name('favorites.destroyByProduct');
});

Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/registration', [UserController::class, 'registration'])->name('registration');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Route::get('/', function () {
//     return Inertia::render('index', ['showModal' => false]);
// })->name('index');
