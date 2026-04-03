<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::inertia('/', 'index', ['categories'=>Category::all()])->name('index');
// Route::get('/', [PageController::class, 'index'])->name('index');

Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/registration', [UserController::class, 'registration'])->name('registration');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Route::get('/', function () {
//     return Inertia::render('index', ['showModal' => false]);
// })->name('index');
