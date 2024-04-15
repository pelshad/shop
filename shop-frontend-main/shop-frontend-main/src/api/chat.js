import axios from "./axios";
import { handleConnectionError, handleApiError } from "./handleError";

// 메시지 보내기
const updateMessage = async (data) => {
    try {
        const res = await axios.post("/chat/send_message", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 메시지 가져오기
const getMessage = async (data, success, setIsSend) => {
    try {
        const res = await axios.post("/chat/sel_content", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
        if (setIsSend !== undefined) {
            setIsSend(false);
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 관리자 채팅방 리스트 가져오기
const getRoom = async (success) => {
    try {
        const res = await axios.get("/chat/sel_admin_room");
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 관리자 채팅 리스트 가져오기
const getAdminMessage = async (data, success, setIsSend) => {
    try {
        const res = await axios.post("/chat/sel_admin_content", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
        if (setIsSend !== undefined) {
            setIsSend(false);
        }
    } catch (error) {
        handleApiError(error);
    }
}

export { updateMessage, getMessage, getRoom, getAdminMessage }