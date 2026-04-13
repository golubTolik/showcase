<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение подписки</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #b4632e;
            padding: 24px;
            text-align: center;
            color: white;
        }
        .content {
            padding: 30px;
        }
        .discount {
            background-color: #f9f1ea;
            border-left: 4px solid #b4632e;
            padding: 15px;
            margin: 20px 0;
            font-size: 18px;
        }
        .btn {
            display: inline-block;
            background-color: #b4632e;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Спасибо за подписку!</h1>
        </div>
        <div class="content">
            <p>Здравствуйте!</p>
            <p>Вы успешно подписались на наши новости. В подарок мы приготовили для вас:</p>

            <div class="discount">
                🎁 <strong>Скидка 10% на первый заказ</strong><br>
                Промокод: <code style="background:#eee; padding:2px 6px; border-radius:4px;">{{ $discountCode }}</code>
            </div>

            <p>📚 <strong>Подборка «5 простых способов сделать дом уютнее»</strong><br>
            Скачайте её по ссылке:</p>
            <p><a href="{{ $bookletUrl }}" class="btn">Получить подборку</a></p>

            <p>Скидка действует при первом заказе на сумму от 1000 ₽. Промокод можно ввести в корзине.</p>
            <p>Если у вас возникнут вопросы, просто ответьте на это письмо.</p>
            <p>С уважением, команда магазина.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Ваш магазин. Все права защищены.
        </div>
    </div>
</body>
</html>
