<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Новый заказ</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color:#333;">

    <h2>Новый заказ #{{ $order->id }}</h2>

    <p>
        <strong>Имя:</strong><br>
        {{ $order->full_name }}
    </p>

    <p>
        <strong>Телефон:</strong><br>
        {{ $order->phone }}
    </p>

    <p>
        <strong>Email:</strong><br>
        {{ $order->email }}
    </p>

    <p>
        <strong>Тип доставки:</strong><br>
        {{ $order->delivery_type }}
    </p>

    @if($order->address)
        <p>
            <strong>Адрес:</strong><br>
            {{ $order->address }}
        </p>
    @endif

    <p>
        <strong>Способ оплаты:</strong><br>
        {{ $order->payment_method }}
    </p>

    @if($order->comment)
        <p>
            <strong>Комментарий:</strong><br>
            {{ $order->comment }}
        </p>
    @endif

    <h3>Товары:</h3>

    <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
        <thead>
            <tr>
                <th align="left">Товар</th>
                <th>Кол-во</th>
                <th>Цена</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td align="center">{{ $item->quantity }}</td>
                    <td align="center">
                        {{ number_format($item->price_at_time, 0, '.', ' ') }} ₽
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p>
        <strong>Сумма заказа:</strong>
        {{ number_format($order->total_price, 0, '.', ' ') }} ₽
    </p>

</body>
</html>
