{{-- <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение подписки</title>
    <style>
        body {
            font-family: 'Gabriela', 'Georgia', 'Times New Roman', serif;
            background-color: #fefaf5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 18px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.05);
            border: 1px solid #f1e3d7;
        }
        .header {
            background: linear-gradient(135deg, #b4632e 0%, #9a4f24 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 400;
            letter-spacing: 1px;
        }
        .content {
            padding: 32px 30px;
            color: #4a3727;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 16px;
        }
        .discount {
            background-color: #faf0e6;
            border-left: 4px solid #b4632e;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            font-size: 16px;
        }
        .discount strong {
            color: #b4632e;
        }
        .discount code {
            background: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 16px;
            font-weight: bold;
            color: #b4632e;
            border: 1px solid #e2cfbe;
            display: inline-block;
            margin-top: 8px;
        }
        .btn {
            display: inline-block;
            background-color: #b4632e;
            color: white;
            padding: 12px 28px;
            text-decoration: none;
            border-radius: 40px;
            margin: 16px 0 8px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background-color: #9a4f24;
        }
        .highlight {
            color: #b4632e;
            font-weight: 600;
        }
        .footer {
            background-color: #faf0e6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #aa8e76;
            border-top: 1px solid #f1e3d7;
        }
        .footer a {
            color: #b4632e;
            text-decoration: none;
        }
        .emoji-icon {
            font-size: 24px;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Спасибо за подписку! ✨</h1>
        </div>
        <div class="content">
            <p>Здравствуйте!</p>
            <p>Вы успешно подписались на наши новости. Мы рады приветствовать вас в нашем уютном сообществе. В подарок мы приготовили для вас:</p>

            <div class="discount">
                <div class="emoji-icon">🎁</div>
                <strong>Скидка 10% на первый заказ</strong><br>
                Промокод: <code>{{ $discountCode }}</code>
                <p style="font-size: 13px; margin-top: 12px; margin-bottom: 0;">Промокод действует при первом заказе на сумму от 1000 ₽.</p>
            </div>

            <p>📚 <strong>Подборка «5 простых способов сделать дом уютнее»</strong><br>
            Скачайте нашу эксклюзивную подборку и создайте атмосферу тепла в вашем доме:</p>
            <p style="text-align: center;">
                <a href="{{ $bookletUrl }}" class="btn">📖 Получить подборку</a>
            </p>

            <p>Скидку можно применить при оформлении заказа в корзине. Подборка придет на ваш email в формате PDF.</p>
            <p>Если у вас возникнут вопросы, просто ответьте на это письмо — мы всегда готовы помочь.</p>
            <p>С уважением,<br><span class="highlight">Команда магазина</span></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Ваш магазин. Все права защищены.<br>
            <a href="{{ $unsubscribeUrl ?? '#' }}">Отписаться от рассылки</a>
        </div>
    </div>
</body>
</html> --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение подписки</title>
    <style>
        body {
            font-family: 'Gabriela', 'Georgia', 'Times New Roman', serif;
            background-color: #fefaf5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 18px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.05);
            border: 1px solid #f1e3d7;
        }
        .header {
            background: linear-gradient(135deg, #b4632e 0%, #9a4f24 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 400;
            letter-spacing: 1px;
        }
        .content {
            padding: 32px 30px;
            color: #4a3727;
            text-align: center;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 16px;
        }
        .btn {
            display: inline-block;
            background-color: #b4632e;
            color: white;
            padding: 12px 28px;
            text-decoration: none;
            border-radius: 40px;
            margin: 16px 0 8px;
            font-weight: 500;
        }
        .footer {
            background-color: #faf0e6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #aa8e76;
            border-top: 1px solid #f1e3d7;
        }
        .footer a {
            color: #b4632e;
            text-decoration: none;
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
            <p>Вы успешно подписались на наши новости. Мы будем присылать вам только самое интересное: акции, новинки и идеи для уюта в доме.</p>
            <p>Чтобы ничего не пропустить, добавьте наш адрес в адресную книгу.</p>
            <p>С уважением,<br><strong style="color:#b4632e;">Команда Рукотворье</strong></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Рукотворье. Все права защищены.<br>
            {{-- <a href="{{ $unsubscribeUrl ?? '#' }}">Отписаться от рассылки</a> --}}
        </div>
    </div>
</body>
</html>
