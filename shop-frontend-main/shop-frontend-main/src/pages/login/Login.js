import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from "api/login";

import loginCheck from 'utils/loginCheck';
import LoginInput from 'components/input/Input';

import * as Style from "assets/styleComponent/login/login"

const Login = () => {
    const nav = useNavigate();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    // 로그인 요청
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            id: id,
            pw: password
        };

        const loginChek = await login(data);

        if (loginChek === "ok") {
            window.location.replace("/");
        }
    };

    // 로그인 되있으면 메인으로
    useEffect(() => {
        if (loginCheck(false) === false) {
            nav("/");
        }
    }, []);

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "id":
                setId(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    };
    return (
        <>
            <Style.Form onSubmit={onSubmit}>
                <div>
                    <h1>로그인</h1>
                    <LoginInput type="text" name='id' placeholder='아이디' onChange={onChange}></LoginInput>
                    <LoginInput type="password" name='password' placeholder='비밀번호' onChange={onChange}></LoginInput>
                    <input type="submit" value="로그인하기" />
                </div>
            </Style.Form>
        </>
    );
};

export default Login;