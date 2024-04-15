import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";

// 토스 결제
const payMentRequest = async (data) => {
    try {
        const res = await axios.post("/order/tos_ins", data);
        handleConnectionError();
        window.location.replace(`/myPage/order/1`);
    } catch (error) {
        handleApiError(error);
    }
}

export { payMentRequest };