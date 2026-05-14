<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Заказ оформлен</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color:#333;">

    <h2>Спасибо за заказ!</h2>

    <p>
        Здравствуйте, {{ $order->full_name }}.
    </p>

    <p>
        Ваш заказ <strong>#{{ $order->id }}</strong> успешно оформлен.
    </p>

    <h3>Состав заказа:</h3>

    <table width="100%" cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
        <thead>
            <tr>
                <th align="left">Товар</th>
                <th>Количество</th>
                <th>Цена</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td align="center">{{ $item->quantity }}</td>
                    <td align="center">{{ number_format($item->price_at_time, 0, '.', ' ') }} ₽</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p>
        <strong>Итого:</strong>
        {{ number_format($order->total_price, 0, '.', ' ') }} ₽
    </p>

    <p>
        <strong>Доставка:</strong>
        {{ $order->delivery_type }}
    </p>

    @if($order->address)
        <p>
            <strong>Адрес:</strong><br>
            {{ $order->address }}
        </p>
    @endif

    <p>
        Мы свяжемся с вами в ближайшее время.
    </p>

</body>
</html>
