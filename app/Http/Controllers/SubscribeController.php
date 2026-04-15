<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
// use App\Mail\SubscriptionConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

        // 1. Добавляем пользователя в список рассылки (через обычный API)
        $subscribeResponse = Http::asForm()->post('https://api.unisender.com/ru/api/subscribe', [
            'format' => 'json',
            'api_key' => env('UNISENDER_API_KEY'), // Ключ от обычного Unisender
            'list_ids' => env('UNISENDER_LIST_ID'),
            'fields' => ['email' => $request->email],
            'double_optin' => 3,
        ]);

        // 2. Отправляем приветственное письмо через Unisender Go API
        $sendEmailKey = env('UNISENDER_GO_API_KEY');
        $fromEmail = env('UNISENDER_GO_FROM_EMAIL');
        $fromName = env('UNISENDER_GO_FROM_NAME');

        // Используем универсальный URL, который направит запрос в ваш дата-центр
        $goApiUrl = 'https://goapi.unisender.ru/ru/transactional/api/v1/email/send.json';

        $emailResponse = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($goApiUrl, [
                'api_key' => $sendEmailKey,
                'message' => [
                    'recipients' => [
                        [
                            'email' => $request->email,
                        ]
                    ],
                    'subject' => 'Добро пожаловать!',
                    'body' => '<h1>Спасибо за подписку!</h1><p>Мы рады приветствовать вас в нашем сообществе.</p>',
                    'from_email' => $fromEmail,
                    'from_name' => $fromName,
                ]
            ]);

        // Логирование результата для отладки
        if ($emailResponse->successful()) {
            Log::info("Приветственное письмо отправлено на {$request->email}");
        } else {
            Log::error('Ошибка Unisender Go: ' . $emailResponse->body());
        }

        return back()->with('success', 'Вы успешно подписались!');
    }
}
