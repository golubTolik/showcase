// Создайте простую функцию-хелпер, например, в файле helpers.js
export function asset(path) {
    
    // Базовый URL вашего приложения, обычно из .env
    const baseUrl = import.meta.env.VITE_APP_URL || '';

    // Убираем лишние слеши
    return `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}
