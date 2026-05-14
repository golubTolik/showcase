<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Отправка письма администратору
        Mail::to(env('MAIL_FROM_ADDRESS'))
            ->send(new ContactFormMail($validated));

        return back()->with(
            'success',
            'Сообщение отправлено. Мы свяжемся с вами в ближайшее время.'
        );
    }
}
