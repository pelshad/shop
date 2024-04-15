import axios from './axios';
import { handleApiError, handleConnectionError, handleTokenError } from './handleError';

const getToken = () => {
    return sessionStorage.getItem('token');
};

const getUserId = () => {
    return sessionStorage.getItem('userId');
};

const setUserId = (userId) => {
    sessionStorage.setItem('userId', userId);
};

const setToken = (token) => {
    sessionStorage.setItem('token', token);
};

const getHeaders = () => {
    const token = getToken();

    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

// 토큰체크
const tokenCheck = async (success) => {
    try {
        const token = getToken();

        if (token) {
            const userId = getUserId();
            const headers = getHeaders();

            const res = await axios.post('/user/checkToken', null, { headers: headers });

            if (!handleConnectionError(res.data)) {
                return;
            }

            if (!userId) {
                setUserId(res.data.id);
            } else {
                if (res.data.res === 'renew') {
                    setToken(res.data.Atoken);
                    setUserId(res.data.id);
                } else if (userId !== res.data.id) {
                    handleTokenError('아이디값이랑 토큰값 불일치로 인해 로그아웃 됩니다.');
                }
            }

            success(res.data);
        }
    } catch (error) {
        handleApiError(error);
    }
};

export { tokenCheck };