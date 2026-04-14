<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status');
        $orders = Order::with('user', 'items.product')
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'full_name' => $order->full_name,
                'phone' => $order->phone,
                'email' => $order->email,
                'delivery_type' => $order->delivery_type,
                'address' => $order->address,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
                'total_price' => $order->total_price,
                'comment' => $order->comment,
                'created_at' => $order->created_at->format('d.m.Y H:i'),
                'user' => $order->user ? ['name' => $order->user->name, 'email' => $order->user->email] : null,
                'items' => $order->items->map(fn($item) => [
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price_at_time' => $item->price_at_time,
                ]),
            ]);

        return Inertia::render('Admin/Orders/index', [
            'orders' => $orders,
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            'currentStatus' => $status,
        ]);
    }

    public function updateStatus(Order $order, Request $request)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Статус заказа обновлён');
    }
}
