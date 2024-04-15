import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";

// 주문리스트 가져오기
// 어드민일땐 모든 유저 주문정보 아니면 내 주문 정보
const getOrder = async (data, success) => {
    try {
        const res = await axios.post("/order/sel_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data)
    } catch (error) {
        handleApiError(error);
    }
}

// 주문코드 가져오기
const getOrderCode = async (data, success) => {
    try {
        const res = await axios.post("/order/sel_user_code_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 주문코드 상세정보 가져오기
const getDetailOrder = async (data, success) => {
    try {
        const res = await axios.post("/order/sel_code_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 주문요청
const requestOrder = async (data) => {
    try {
        const res = await axios.post("/order/ins_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
    } catch (error) {
        handleApiError(error);
    }
}

//구매 확정
const recognizeOrder = async (data) => {
    try {
        const res = await axios.post("/order/recognize_order", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        alert("구매 완료 처리되었습니다.");
        window.location.replace(`/myPage/orderDetail/${data.orderCode}`);
    } catch (error) {
        handleApiError(error);
    }
}

// 주문취소
const cancelOrder = async (data) => {
    try {
        const res = await axios.post("/order/cancel_order", data);
        if (!handleConnectionError(res.data)) {
            return
        }
        if (data.cancelType === "requestAdmin") {
            alert("주문 취소 요청을 하였습니다.");
            window.location.reload();
        }
        else if (data.cancelType === "requestPg") {
            alert("주문 취소 되었습니다.");
            window.location.reload();
        } else if (data.cancelType === "refusal") {
            alert("주문취소 요청을 거절하였습니다.");
            window.location.reload();
        } else {
            alert("알 수 없는 에러가 발생했습니다. 관리자에게 문의 부탁드립니다.");
        }
    } catch (error) {
        handleApiError(error);
    }
}

//환불/반품 요청
const returnOrder = async (data) => {
    try {
        const res = await axios.post("order/refund_order", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        alert("환불 신청 완료");
        window.location.replace(`/myPage/orderDetail/${data.orderCode}`);
    } catch (error) {
        handleApiError(error);
    }
}

//환불 승인
const recognizeRefund = async (data) => {
    try {
        const res = await axios.post("order/refund_complete", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        alert("환불 처리 완료");
        window.location.reload();
    } catch (error) {
        handleApiError(error);
    }
}

// 주문완료
const completeOrder = async (data, success) => {
    try {
        const res = await axios.post("/order/sel_ini_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (res.data[0].resultCode === "0000") {
            success(res.data[0]);
        } else {
            alert("알수없는 에러로 실패하였습니다. \n관리자에게 문의 부탁드립니다.");
            window.location.replace("/");
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 주문 총 상황
const getTotalOrderStatus = async (success) => {
    try {
        const res = await axios.get("/order/sel_dash");
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res);
    } catch (error) {
        handleApiError(error);
    }
}

// 주문 리스트 다운로드
const downOrderList = async (success) => {
    try {
        const res = await axios.get("/order/admin_orders");
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res);
    } catch (error) {
        handleApiError(error);
    }
}

//취소, 환불인 데이터만 불러오기
const getRefundDataList = async (success) => {
    try {
        const res = await axios.get("/order/get_refund_data");
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 구매확정
const orderComplete = async (data) => {
    try {
        const res = await axios.post("/order/complete_orders", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        window.location.reload();
    } catch (error) {
        handleApiError(error);
    }
}

export {
    getOrder,
    getOrderCode,
    getDetailOrder,
    recognizeOrder,
    cancelOrder,
    returnOrder,
    recognizeRefund,
    requestOrder,
    completeOrder,
    getTotalOrderStatus,
    downOrderList,
    getRefundDataList,
    orderComplete
};

