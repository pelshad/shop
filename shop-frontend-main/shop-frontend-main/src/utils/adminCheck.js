// 관리자 체크
const adminCheck = (isAlert) => {
    if (sessionStorage.getItem("userId") !== "admin" &&
        sessionStorage.getItem("userId") !== "asd" &&
        sessionStorage.getItem("userId") !== "pkd") {
        isAlert && alert("접근불가능합니다.");
        return false;
    } else {
        return true
    }
}

export default adminCheck;