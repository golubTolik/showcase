<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscribeController;
// use App\Models\Category;
// use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminProductController;


Route::get('/',[PageController::class, 'index'])->name('index');
// Route::inertia('/catalog', 'catalog', [
//     'categories'=> Category::all(),
//     'products' => Product::with(['images' => fn($q) => $q->orderBy('sort_order'), 'product_attribute_values.attribute_value.attribute'])->get(),
// ])->name('catalog');
Route::get('/catalog', [PageController::class, 'catalog'])->name('catalog');
Route::get('/products/show/{product}', [ProductController::class, 'show'])->name('products.show');

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

Route::middleware('auth')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::post('/subscribe', [SubscribeController::class, 'store'])->name('subscribe.store');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contacts', function () {
    return Inertia::render('contacts');
})->name('contacts');

Route::post('/contact/send', [App\Http\Controllers\ContactController::class, 'send'])->name('contact.send');

Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/registration', [UserController::class, 'registration'])->name('registration');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Заказы
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    // Категории
    Route::resource('categories', AdminCategoryController::class)->except(['show']);

    // Товары
    Route::resource('products', AdminProductController::class);
    Route::post('/products/{product}/images', [AdminProductController::class, 'uploadImage'])->name('products.upload-image');
    Route::delete('/products/images/{image}', [AdminProductController::class, 'deleteImage'])->name('products.delete-image');
});
