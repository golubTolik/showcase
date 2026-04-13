<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubscriptionConfirmation;

class SubscribeController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:subscribers,email',
            'agreement' => 'accepted',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Subscriber::create(['email' => $request->email]);

        // Отправка письма
        try {
            Mail::to($request->email)->send(new SubscriptionConfirmation($request->email));
        } catch (\Exception $e) {
            \Log::error('Ошибка отправки письма подписки: ' . $e->getMessage());
        }

        return back()->with('success', 'Вы успешно подписались! Скидка и подборка отправлены на ваш email.');
    }
}
