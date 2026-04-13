<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Order_item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
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
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'delivery_type' => 'required|in:courier,pickup,post',
            'address' => 'required_if:delivery_type,courier,post|nullable|string|max:500',
            'payment_method' => 'required|in:card,cash,bank',
            'comment' => 'nullable|string',
        ]);

        $userId = Auth::id();
        $sessionId = session()->getId();

        // Находим корзину пользователя/сессии
        $cart = Cart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Корзина пуста');
        }

        $totalPrice = $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        DB::beginTransaction();
        try {
            // Создаём заказ
            $order = Order::create([
                'user_id' => $userId,
                'full_name' => $request->full_name,
                'phone' => $request->phone,
                'email' => $request->email,
                'delivery_type' => $request->delivery_type,
                'address' => $request->address,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'total_price' => $totalPrice,
                'comment' => $request->comment,
            ]);

            // Переносим позиции корзины в заказ
            foreach ($cart->items as $cartItem) {
                Order_item::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price_at_time' => $cartItem->product->price,
                ]);

                // Уменьшаем остаток товара
                $product = $cartItem->product;
                $product->decrement('stock', $cartItem->quantity);
            }

            // Очищаем корзину
            $cart->items()->delete();

            DB::commit();

            // Можно отправить уведомление на email и т.п.

            // Возвращаемся на страницу корзины с флеш-сообщением об успехе
            return redirect()->route('cart.index')->with('flash', [
                'success' => 'Заказ успешно оформлен! Номер заказа: ' . $order->id,
                'showModal' => false
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with(['error' => 'Ошибка оформления заказа: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
