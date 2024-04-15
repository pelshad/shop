import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Style from "assets/styleComponent/admin/category/register"

const RegisterCate = ({ onChange, category, title }) => {
    const nav = useLocation();
    const params = new URLSearchParams(nav.search);
    return (
        <>
            <Style.Bg></Style.Bg>
            <Style.Box>
                <h3>{title}</h3>
                <input type="text" name="registerCate" onChange={onChange} placeholder="카테고라 명" />
                <button onClick={() => {
                    params.get("lowIndex") === null
                        ? category(params.get("index"))
                        : category(params.get("index"), params.get("lowIndex"))
                }}>확인</button>
                <Link to={"/admin/Category"}>닫기</Link>
            </Style.Box>
        </>
    );
};
export default RegisterCate;