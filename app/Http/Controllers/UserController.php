<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function registration(Request $request)
    {
        $request->validate([
            // 'name' => 'required|regex:/^[А-Яа-яЁё\s-]+$/u',
            'name' => 'required',
            'email' => 'required|email:frc|unique:users',
            // 'password' => 'required|min:8|confirmed',
            'password' => 'required|min:8',
            'rule' => 'required',
        ],[
            'required'=>'Поле обязательно для заполнения',
            'name.regex'=>'Используйте кирилицу и пробел',
            'password.min'=>'Не менее 8 символов',
            'email.unique'=>'Этот email уже занят',
            // 'confirmed'=>'Пароль должен совпадать'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        dd($user);
        $user->password = bcrypt($request->password);

        $user->save();
        if($user){
            Auth::login($user);
        }
        return redirect()->back();
    }
    public function login(Request $request){
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ],[
            'required'=>'Поле обязательно для заполнения',
        ]);
        // $user = User::query()
        //     ->where('email', $request->email)
        //     ->first();
        // if($user && Hash::check($request->password, $user->password)){
        //     Auth::login($user);
        //     return redirect()->route('index')->with('success','Вы авторизованны!');
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            return redirect()->route('index')->with('success','Вы авторизованны!');
        } else{
            return redirect()->back()->with('error','Неверный логин или пароль');
        }
    }
    public function logout(){
        Auth::logout();
        return redirect()->route('index');
    }
}
