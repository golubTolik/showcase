<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'index')->name('index');
// Route::inertia('/index', 'index')->name('index');
// Route::inertia('/auth', 'auth')->name('auth');

Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/registration', [UserController::class, 'registration'])->name('registration');
