import React, { useState } from 'react';
import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';

const DaumPost = ({ setAddress, setZoneCode, setIsPostOpen }) => {
    // 우편 주소 찾기
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setZoneCode(data.zonecode);
        setAddress(fullAddress);
        setIsPostOpen(false);
    };

    return (
        <Container>
            <div className='daumPost' style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
            }}>
                <button onClick={() => { setIsPostOpen(false) }}>창 닫기</button>
                <DaumPostcode className='post' style={{
                    width: "400px",
                    height: "500px",
                }} onComplete={handleComplete}></DaumPostcode>
            </div>
        </Container >
    );
};

const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #00000066;
    button{
        background-color: #fff;
        margin-bottom: 5px;
        padding: 5px 20px;
        border-radius:50px;
        cursor: pointer;
    }

    @media (max-width:400px) {
        .post{
            width: 320px !important;
            height: 400px !important;
        }
    }
`

export default DaumPost;