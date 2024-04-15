import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";
import { login } from "./login";
import { encrypt } from "utils/crypto";

// 회원가입
const signup = async (data) => {
    try {
        const encryptedData = encrypt(JSON.stringify(data));
        const res = await axios.post("/user/ins_user", { encryptedData });
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (res.data.id === false) {
            alert("중복된 아이디입니다.");
        } else if (res.data.email === false) {
            alert("중복된 이메일입니다.");
        } else if (res.data.tall === false) {
            alert("중복된 이메일입니다.");
        } else {
            await login({ id: data.id, pw: data.pw });
            alert("회원가입 완료되었습니다.");
            window.location.replace("/");
        }
    } catch (error) {
        handleApiError(error);
    }
}

export { signup }