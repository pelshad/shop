import { handleApiError } from './handleError';

// 로그아웃
const logout = async () => {
    try {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        window.location.replace("/");
    } catch (error) {
        handleApiError(error);
    }
};

export { logout };