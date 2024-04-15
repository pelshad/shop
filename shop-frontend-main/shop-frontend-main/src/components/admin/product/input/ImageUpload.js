import React, { useEffect } from 'react';
import styled from "styled-components";

const ProductInput = ({ title, setThumbnail, thumbnail }) => {
    // 이미지 가져오기
    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setThumbnail(result);
        };
        reader.readAsDataURL(theFile);
    }

    return (
        <Div>
            <span dangerouslySetInnerHTML={{ __html: title }}></span>
            <div>
                <input type="file" accept="image/*" onChange={onFileChange} />
                <img src={thumbnail} />
            </div>
        </Div>
    );
};

const Div = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    span{
        display: inline-block;
        width: 150px;
    }
    img{
        display: block;
        padding-top: 10px;
        max-width: 300px;
    }
`;

export default ProductInput;