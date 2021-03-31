// функция возвращает значение cookie по ключу
export function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }

    return undefined;
}

// функция удаляет cookie по ключу
export function deleteCookie(name: string): void {
    setCookie(name, "");
}

export function setCookie(name: string, value: string) {
    const date = new Date();

    // Установить срок действия на 7 дней
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// функция устанавливает cookie
function setCookie2(name: string, value: string, options: any={}): void {
    options = {
        path: '/'
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updateCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
        updateCookie += '; ' + optionKey;

        let optionValue = options[optionKey];

        if (optionValue !== true) {
            updateCookie += '=' + optionValue;
        }
    }

    document.cookie = updateCookie;
}
