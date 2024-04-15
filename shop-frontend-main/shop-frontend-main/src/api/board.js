import axios from "./axios";
import { handleApiError, handleConnectionError } from "./handleError";
import { encrypt } from "utils/crypto";

// 게시글 가져오기
const getBoard = async (data, success) => {
    try {
        const res = await axios.post("/board/sel_board", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    }
}

// 게시글 내용 가져오기
const getDetailBoard = async (data, success) => {
    try {
        const res = await axios.post("/board/detail_board", data);
        if (!handleConnectionError(res.data)) {
            return;
        }
        success(res.data);
    } catch (error) {
        handleApiError(error);
    };
}

// 게시글 작성
const addBoard = async (data) => {
    try {
        const encryptedData = encrypt(JSON.stringify(data));
        const res = await axios.post("/editor/ins_editor_data", { encryptedData });
        if (!handleConnectionError(res.data)) {
            return;
        }
        if (res.data.result === "success") {
            alert("등록완료");
            if (data.type === "product") {
                window.location.replace("/admin/product/1");
            } else {
                const nextPage = data.type === "review" ? "all/1" : "1";
                window.location.replace(`/community/${data.type}/${nextPage}`);
            }
        } else if (res.data.result === "fail") {
            alert("알 수 없는 에러로 등록실패 했습니다.");
        } else {
            alert("알 수 없는 에러로 등록실패 했습니다.");
        }
    } catch (error) {
        handleApiError(error);
    }
}

// 게시글 삭제
const deleteBoard = async (data) => {
    try {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            const res = await axios.post("/board/del_board", data);
            if (!handleConnectionError(res.data)) {
                return;
            }
            alert("삭제되었습니다.");
            window.location.replace(`/community/${data.type}/1`);
        }
    } catch (error) {
        handleApiError(error);
    }
}

export { getBoard, getDetailBoard, addBoard, deleteBoard };