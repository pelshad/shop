import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";

// 메인으로 리다렉션 시켜줌
const refresh = () => {
    try {
        const res = axios.post("/user/refresh_page");
        if (!handleConnectionError(res.data)) {
            return;
        }
    } catch (error) {
        handleApiError(error)
    }
}

export { refresh }