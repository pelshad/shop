//로그인체크
const loginCheck = (isAlert) => {
    if (isAlert) {
        if (sessionStorage.getItem("userId") === null ||
            sessionStorage.getItem("token") === null) {
            alert("로그인 후 이용가능합니다.");
            return true;
        }
    } else {
        if (sessionStorage.getItem("userId") !== null ||
            sessionStorage.getItem("token") !== null) {
            alert("로그인중에는 접근 하실 수 없습니다.");
            return false
        }
    }
}

export default loginCheck;