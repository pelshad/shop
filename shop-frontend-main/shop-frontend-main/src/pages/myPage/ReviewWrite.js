import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { addBoard } from "api/board.js";

import createCode from 'utils/createCode';
import dateFormat from 'utils/dateFormat';

import SubTitle from 'components/myPage/SubTitle';
import LoginInput from 'components/input/Input';
import StartGrade from 'components/input/StarGrade';

import * as Common from "assets/styleComponent/myPage/myPage"
import ImageUpload from 'components/input/ImageUpload';

import noImg from "assets/images/noImg.gif";


const ReviewWrite = () => {
    const { productCode, orderCode } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [firstImage, setFirstImage] = useState("");
    const [secondImage, setSecondImage] = useState("");
    const [star, setStar] = useState(5);

    const location = useLocation();
    const goods_name = location.state.goods_name;
    const goods_img = location.state.goods_img;

    // 리뷰 작성
    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            user_id: sessionStorage.getItem("userId"),
            title: title,
            content: content.replace(/\r?\n/g, "<br>"),
            firstImage: firstImage,
            secondImage: secondImage,
            date: dateFormat(),
            code: createCode(),
            order_code: orderCode,
            goods_code: productCode,
            type: "review",
            grade: star
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
            case "content":
                setContent(value);
                break;
            default:
                break;
        }
    };

    //평점
    const settingStar = (num) => {
        setStar(num);
    }

    return (
        <Common.InDiv>
            <SubTitle h2={"상품후기 작성"} h3={"구매하신 상품후기를 작성 하실 수 있습니다."} clickEvent={null} clickText={null} />

            <Common.ReviewTitle>
                <div>
                    <img src={
                        goods_img === ""
                            ? noImg
                            : goods_img
                    } alt="" />
                </div>
                <div><p>{goods_name}</p></div>

            </Common.ReviewTitle>
            <Common.ReviewForm onSubmit={onSubmit}>
                <StartGrade settingStar={settingStar} />
                <LoginInput maxLength={100} type="text" name="title" value={title} placeholder="제목 최대 100자" onChange={onChange}></LoginInput>
                <textarea maxLength={1000} name="content" value={content} onChange={onChange} placeholder="내용 최대 1000자"></textarea>
                <ImageUpload setImageData={setFirstImage} />
                <ImageUpload setImageData={setSecondImage} />
                <Common.Button>
                    <button>글쓰기</button>
                </Common.Button>
            </Common.ReviewForm>
        </Common.InDiv>
    );
};

export default ReviewWrite;