import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { addBoard } from "api/board.js"

import adminCheck from 'utils/adminCheck';
import createCode from 'utils/createCode';
import dateFormat from 'utils/dateFormat';

import LoginInput from 'components/input/Input';
import TextEditor from 'components/editor/Editor';

import * as Style from "assets/styleComponent/community/write";

const NoticeWrite = () => {
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageCode, setImageCode] = useState([]);

    // 관리자 체크
    useEffect(() => {
        if (adminCheck(true) === false) {
            nav("/");
        }
    }, [])

    // 게시글 등록
    const onSubmit = async (e) => {
        e.preventDefault();

        if (adminCheck(true) === false) {
            nav("/");
        }

        // 에디터 실제로 이미지 있는지없는지 확인하고 없으면 지워줌
        let arr = imageCode;
        for (let i = 0; i < imageCode.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (content.indexOf(imageCode[i]) === -1) {
                    if (arr[j] === imageCode[i]) {
                        arr.splice(j, 1);
                        j--;
                    }
                }
                setImageCode(arr);
            }
        }

        const data = {
            user_id: sessionStorage.getItem("userId"),
            title: title,
            content: content,
            date: dateFormat(),
            image_code: imageCode,
            code: createCode(),
            type: "notice",
        }

        addBoard(data);
    }

    const onChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        switch (name) {
            case "title":
                setTitle(value);
                break;
            default:
                break;
        }
    };

    return (
        <Style.Write>
            <h2>공지사항 글쓰기</h2>
            <form onSubmit={onSubmit}>
                <LoginInput type="text" name="title" value={title} placeholder="제목" onChange={onChange}></LoginInput>
                <TextEditor setContent={setContent} setImageCode={setImageCode} width="" type="notice"></TextEditor>
                <Style.Button>
                    <button>글쓰기</button>
                </Style.Button>
            </form>
        </Style.Write>
    );
};

export default NoticeWrite;