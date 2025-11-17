

export function getTokenDuration() {
    const expirationDate = localStorage.getItem('expiration');
    const now = new Date();
    const expiration = new Date(expirationDate);
    const duration = expiration.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = localStorage.getItem('token');

    const tokenDuration = getTokenDuration(); // Optional: you can use this to check token validity
    if (tokenDuration <= 0) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('expiration');
        // return null;
        return "EXPIRED";
    };
    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token = getAuthToken();
    if (!token) {
        throw new Response('Unauthorized', { status: 401 });
    }
    return token;
};