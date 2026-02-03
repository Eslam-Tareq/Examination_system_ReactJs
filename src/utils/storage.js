const TOKEN_KEY = "examy_access_token";
const USER_KEY = "examy_user";
export const storage = {
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
    getUser: () => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    },
    setUser: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    removeUser: () => {
        localStorage.removeItem(USER_KEY);
    },
};
