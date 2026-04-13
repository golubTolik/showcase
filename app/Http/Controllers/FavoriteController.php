<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $favorites = $user->favorites()->with('product.images')->get();

        $favoriteProducts = $favorites->map(function ($favorite) {
            $product = $favorite->product;
            return [
                'id' => $favorite->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'description' => $product->description,
                'image' => $product->images->first()?->image_url ?? null,
            ];
        });

        return Inertia::render('Favorites/index', [
            'favorites' => $favoriteProducts,
        ]);
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
        $request->validate(['product_id' => 'required|exists:products,id']);
        $user = Auth::user();

        if (!$user) {
            return back()->with(['error' => 'Необходимо авторизоваться']);
        }

        Favorite::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Добавлено в избранное');
    }

    /**
     * Display the specified resource.
     */
    public function show(Favorite $favorite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favorite $favorite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Favorite $favorite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Favorite $favorite)
    {
        if (Auth::id() !== $favorite->user_id) {
            abort(403);
        }
        $favorite->delete();
        return back()->with('success', 'Удалено из избранного');
    }
    public function destroyByProduct(Request $request)
    {
        // $request->validate(['product_id' => 'required|exists:products,id']);
        $productId = $request->route('product');
        $user = Auth::user();

        if (!$user) {
            return back()->with('error', 'Необходимо авторизоваться');
        }

        $favorite = Favorite::where('user_id', $user->id)
                            ->where('product_id', $productId)
                            ->first();

        if ($favorite) {
            $favorite->delete();
            return back()->with('success', 'Удалено из избранного');
        }

        return back()->with('error', 'Товар не найден в избранном');
    }

}
