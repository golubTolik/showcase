<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Новое сообщение</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">

    <h2>Новое сообщение с сайта</h2>

    <p>
        <strong>Имя:</strong><br>
        {{ $data['name'] }}
    </p>

    <p>
        <strong>Email:</strong><br>
        {{ $data['email'] }}
    </p>

    <p>
        <strong>Сообщение:</strong><br>
        {!! nl2br(e($data['message'])) !!}
    </p>

</body>
</html>
