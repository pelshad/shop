import axios from './axios';
import { handleApiError, handleConnectionError } from './handleError';

// 장바구니 담기
const addBasket = async (data) => {
    try {
        const res = await axios.post("/order/saveBasket", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        alert("장바구니에 등록되었습니다.");
    } catch (error) {
        handleApiError(error);
    }
}

// 장바구니 상품 정보 가져오기
const getBasket = async (data, success) => {
    try {
        const res = await axios.post('/order/findBasketByUserId', data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
};

// 장바구니 상품 정보 가져오기
const deleteBasket = async (data) => {
    try {
        const res = await axios.post('/order/deleteBasket', data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (res.data !== "success") {
            alert("알 수 없는 에러로 실패 하였습니다.");
        }
    } catch (error) {
        handleApiError(error);
    }
};

export { getBasket, addBasket, deleteBasket };