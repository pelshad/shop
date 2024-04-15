import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";

// 알림 리스트 가져오기
const getNotification = async (data, success, readCount) => {
    try {
        const res = await axios.post("/notification/NotifyToUser", data);
        let count = 0;
        if (!handleConnectionError(res.data)) {
            return;
        }
        res.data.forEach(el => {
            if (el.check_yn === "N") {
                count++;
            }
        });
        success(res.data);
        readCount(count);
    } catch (error) {
        handleApiError(error);
    }
}

// 알림 확인 체크
const updateNotification = async (data) => {
    try {
        const res = await axios.post("/notification/checkNotification", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
    } catch (error) {
        handleApiError(error);
    }
}


export { getNotification, updateNotification }