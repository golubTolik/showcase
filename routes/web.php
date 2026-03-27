<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'index')->name('home');
Route::inertia('/welcome', 'welcome')->name('welcome');
Route::inertia('/store', 'store')->name('store');
