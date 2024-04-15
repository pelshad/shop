import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { passwordCheck } from "api/user.js"

import loginCheck from 'utils/loginCheck';

import LoginInput from 'components/input/Input';
import SubTitle from 'components/myPage/SubTitle';

import * as Common from "assets/styleComponent/myPage/myPage";
import * as Style from "assets/styleComponent/myPage/info";


const PersonalModify = ({ setInfoData }) => {
    const nav = useNavigate();
    const [password, setPassword] = useState("");

    // 비밀번호 확인
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user_id: sessionStorage.getItem("userId"),
            user_pw: password,
        };

        await passwordCheck(data, setInfoData);

        nav("/myPage/info");
    };

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    };

    return (
        <Common.InDiv>
            <SubTitle h2={"개인 정보 수정"} h3={"회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한 번 확인해주세요."} clickEvent={null} clickText={null} />
            {
                <Style.Div>
                    <Style.Form onSubmit={onSubmit}>
                        <div>
                            <div className='inputTitle'>비밀번호</div>
                            <div><LoginInput type="password" name='password' onChange={onChange}></LoginInput></div>
                        </div>
                        <input type='submit' value='확인'></input>
                    </Style.Form>
                </Style.Div>
            }
        </Common.InDiv >
    );
};


export default PersonalModify;