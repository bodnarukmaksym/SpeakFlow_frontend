class AuthService {
    private readonly TOKEN_KEY = 'speakflow_access_token';

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    logout(): void {
        this.removeToken();
        window.location.href = '/auth';
    }
}

export const authService = new AuthService();