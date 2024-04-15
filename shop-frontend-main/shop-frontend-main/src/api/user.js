import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";

// 회원 방문자 수 가져오기
const getUserAccessCount = async (success) => {
    try {
        const res = await axios.get("/data/sel_user_count");
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res);
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 방문 카운팅
const updateUserAccessCount = async (data) => {
    try {
        const res = await axios.get("/data/user_count", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 정보 가져오기
const getUserInfo = async (data) => {
    try {
        const res = await axios.post("/user/sel_user_data", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        data.result = res.data[0];
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 리스트
const getUserList = async (data, success) => {
    try {
        const res = await axios.post("/user/sel_user_list", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 정보 변경
const updateUser = async (data) => {
    try {
        const res = await axios.post("/user/upd_user", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (res.data.result[0] === 'fail') {
            alert("비밀번호가 틀렸습니다.");
            window.location.replace("/myPage/info");
        } else {
            alert("수정이 완료되었습니다.");
            window.location.replace("/myPage/personalModify");
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 삭제
const deleteUser = async (data) => {
    try {
        if (data.deleteReqType === "user") {
            if (window.confirm("정말로 탈퇴 하시겠습니까?")) {
                const res = await axios.post("/user/del_user", data);
                if (!handleConnectionError(res.data)) {
                    return;
                }
                if (res.data === "success") {
                    alert("탈퇴완료");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("userId");
                    window.location.replace("/");
                } else {
                    alert("알수없는 이유로 에러발생");
                }
            }
        } else {
            if (window.confirm("정말로 삭제하시겠습니까?")) {
                const res = await axios.post("/user/del_user", data);
                if (!handleConnectionError(res.data)) {
                    return;
                }
                if (res.data === "success") {
                    alert("삭제완료");
                    window.location.reload();
                } else {
                    alert("알수없는 이유로 에러발생");
                }
            }
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 배송지 가져오기
const getAddress = async (data, success) => {
    try {
        const res = await axios.post("/user/user_address", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 배송지 추가
const addAddress = async (data, success) => {
    try {
        const res = await axios.post("/user/add_address", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
        alert("신규배송지가 추가되었습니다.");
        window.location.replace("/myPage/address");
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 기본 배송지 가져오기
const getDefaultAddress = async (data, success) => {
    try {
        const res = await axios.post("/delivery/address_list", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 기본 배송지 설정
const setDefaultAddress = async (data) => {
    try {
        const res = await axios.post("/user/set_default_address", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        alert("기본 배송지로 설정되었습니다.");
        window.location.replace("/myPage/address");
    } catch (error) {
        handleApiError(error);
    }
}

// 회원 배송지 삭제
const deleteAddress = async (data) => {
    try {
        if (window.confirm("정말로 삭제 하시겠습니까?")) {
            const res = await axios.post("/user/del_address", data);
            if (!handleConnectionError(res.data)) {
                return;
            }
            alert("배송지가 삭제되었습니다.");
            window.location.replace("/myPage/address");
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 회원이 구매한 상품 리스트
const getBuyProduct = async (data, success) => {
    try {
        const res = await axios.post("/user/sel_user_review", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 비밀번호 확인
const passwordCheck = async (data, success) => {
    try {
        const res = await axios.post('/user/check_pw', data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (data.delete === "delete") {
            deleteUser({ user_id: sessionStorage.getItem("userId"), deleteReqType: "user" });
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
};

// 유저 포인트
const getUserPoint = async (data, success) => {
    try {
        const res = await axios.post("/user/findPointByUserId", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data[0].user_point);
    } catch (error) {
        handleApiError(error)
    }
}

export {
    getUserAccessCount,
    updateUserAccessCount,
    getUserList,
    getUserInfo,
    updateUser,
    deleteUser,
    getAddress,
    addAddress,
    getDefaultAddress,
    setDefaultAddress,
    deleteAddress,
    getBuyProduct,
    passwordCheck,
    getUserPoint
};