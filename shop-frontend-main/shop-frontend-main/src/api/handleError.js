import axios from "axios";

// 통신에러
const handleApiError = async (error) => {
    if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        return;
    }
    if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못함
        console.log(error.request);
    } else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생
        console.log("Error", error.message);
    }
    console.log(error.config);
    // window.location.replace("/error");
};

// 통신 성공했는데 에러 터짐
const handleConnectionError = (res) => {
    if (res.error === "E00") {
        handleTokenError("올바르지 않은 토큰값 로그아웃 됩니다.\n error code : E00");
        return false;
    } else if (res.error === "E01") {
        handleTokenError("액세스 토큰 만료. \n error code : E01");
        return false;
    } else if (res.error === "E02") {
        handleTokenError("다른 브라우저에서 로그인을 시도하여 로그아웃 됩니다. \n error code : E02");
        return false;
    } else if (res.error === "E03") {
        handleTokenError("리프레시 토큰 만료. \n error code : E03");
        return false;
    } else if (res.error === "E05") {
        handleTokenError("토큰값이 일치하지 않습니다 로그아웃 됩니다. \n error code : E05");
        return false;
    } else if (res.error === "E06") {
        handleTokenError("다른 브라우저에서 로그인을 시도하여 로그아웃 됩니다. \n error code : E06");
        return false;
    } else if (res.error === "E07") {
        handleTokenError("알 수 없는 에러으로 로그아웃 됩니다. \n error code : E07");
        return false;
    } else if (res.error === "E21") {
        errorMessage("결제 취소 실패했습니다. \n error code : E21", true);
        return false;
    } else if (res.error === "E22") {
        errorMessage("사용 적립금이 가지고 있는 적립금을 초과했습니다. \n error code : E22", true);
        return false;
    } else if (res.error === "E23") {
        localStorage.removeItem('basket');
        errorMessage("가격 정보가 다릅니다. \n error code : E23", true);
    } else if (res.error === "E11") {
        errorMessage("PDO 예외발생하였습니다. \n error code : E11", true);
        return false;
    } else if (res.error === "E12") {
        errorMessage("DB적용 실패하였습니다. \n error code : E12", true);
        return false;
    } else if (res.error === "E13") {
        errorMessage("잘못된 파라미터 값입니다 \n error code : E13", true);
        return false;
    } else if (res.error === "E14") {
        errorMessage("상품명 중복입니다 \n error code : E14", false);
        return false;
    }

    // 에러 코드 없이 에러나면
    if (/.*error*./.test(res)) {
        errorMessage(`FATAL ERROR!!! 관리자에게 문의해주세요` + res, true);
        return false;
    }

    return true;
}

// 토큰에러
const handleTokenError = (msg) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    alert(msg);
    window.location.replace("/");
}

// 에러 메세지
const errorMessage = (msg, isErrorPage) => {
    alert(msg);
    if (isErrorPage) {
        // window.location.replace("/error");
    }
}

export { handleApiError, handleTokenError, handleConnectionError };