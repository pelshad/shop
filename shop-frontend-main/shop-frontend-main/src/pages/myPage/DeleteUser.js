import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { passwordCheck } from "api/user.js"

import loginCheck from 'utils/loginCheck';

import LoginInput from 'components/input/Input';
import SubTitle from 'components/myPage/SubTitle';

import * as Common from "assets/styleComponent/myPage/myPage";
import * as Style from "assets/styleComponent/myPage/info";


const DeleteUser = () => {
    const [password, setPassword] = useState("");

    // 비밀번호 확인
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user_id: sessionStorage.getItem("userId"),
            user_pw: password,
            delete: 'delete',
        };

        await passwordCheck(data);
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
            <SubTitle h2={"회원탈퇴"} h3={"회원탈퇴를 위해 비밀번호를 확인해주세요."} clickEvent={null} clickText={null} />
            {
                <Style.Div>
                    <Style.Form onSubmit={onSubmit}>
                        <div>
                            <div className='inputTitle'>비밀번호</div>
                            <div><LoginInput type="password" name='password' onChange={onChange}></LoginInput></div>
                        </div>
                        <input style={{ letterSpacing: '3px' }} type='submit' value='탈퇴하기'></input>
                    </Style.Form>
                </Style.Div>
            }
        </Common.InDiv >
    );
};


export default DeleteUser;