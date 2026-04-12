<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Cart_item;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Laravel\Prompts\alert;

class CartController extends Controller
{
    protected function getCart()
    {
        $sessionId = session()->getId();
        $userId = Auth::id();

        $cart = Cart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
            ]);
        }

        return $cart;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart = $this->getCart();
        $cart->load('items.product.images');

        $cartItems = $cart->items->map(function ($item) {
            $product = $item->product;
            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $item->quantity,
                'total' => $product->price * $item->quantity,
                'image' => $product->images->first()?->image_url ?? null,
            ];
        });

        $totalPrice = $cartItems->sum('total');

        return Inertia::render('Cart/index', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
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
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $product = Product::findOrFail($request->product_id);

        // Проверяем наличие на складе
        if ($product->stock < $request->quantity) {
            return back()->withErrors(['stock' => 'Недостаточно товара на складе']);
        }

        $cartItem = Cart_item::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Обновляем количество
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($product->stock < $newQuantity) {
                return back()->withErrors(['stock' => 'Недостаточно товара на складе']);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            Cart_item::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Товар добавлен в корзину');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart_item $cartItem)
    {
         $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;
        if ($product->stock < $request->quantity) {
            return response()->json(['error' => 'Недостаточно товара'], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return redirect()->route('cart.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart_item $cartItem)
    {
        $cartItem->delete();
        return redirect()->route('cart.index')->with('success', 'Товар удалён');
    }

}
