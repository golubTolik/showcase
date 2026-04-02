<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function registration(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email:frc|unique:users',
            'password' => 'required|min:8',
        ],[
            'required'=>'Поле обязательно для заполнения',
            'name.regex'=>'Используйте кирилицу и пробел',
            'password.min'=>'Не менее 8 символов',
            'email.unique'=>'Этот email уже занят',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);

        $user->save();
        if($user){
            Auth::login($user);
        }
        return redirect()->back()->with('showModal', false);
    }
    public function login(Request $request){
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ],[
            'required'=>'Поле обязательно для заполнения',
        ]);
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            return redirect()->back()->with('showModal', false);
        } else{
            return redirect()->back()->with('error','Неверный логин или пароль');
        }
    }
    public function logout(){
        Auth::logout();
        return redirect()->route('index');
    }
}
