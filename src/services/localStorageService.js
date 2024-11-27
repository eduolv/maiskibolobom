export const localStorageService = {
    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : [];
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
};
