import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/**
 * @param {*} board 게시글리스트
 * @param {*} setBoardList 검색값으로 새로 게시글리스트 변경
 * @param {*} searchType 검색타입
 * @param {*} reset 상품리스트 리셋 상품관련만 필요 나머지 리스트는 null 넣으면됨
 * @returns 
 */
const Searching = ({ board, setBoardList, searchType, reset }) => {
    const nav = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    const searchTypes = {
        notice: {
            prop: "title",
            placeholder: "제목 검색"
        },
        order: {
            prop: "orderCode",
            placeholder: "주문번호 검색"
        },
        user: {
            prop: "user_email",
            placeholder: "이메일 검색"
        },
        product: {
            prop: "goods_nm",
            placeholder: "상품명 검색"
        },
        adminProduct: {
            prop: "goods_nm",
            placeholder: "상품명 검색"
        },
    };

    const search = () => {
        if (searchValue.length <= 1) {
            alert("2글자 이상 입력해주세요");
            return;
        }

        if (searchType === "notice") {
            nav(`/community/notice/1?search=${searchValue}`);
        } else if (searchType === "user") {
            nav(`/admin/user/1?search=${searchValue}`);
        } else if (searchType === "order") {
            nav(`/admin/order/1?search=${searchValue}`);
        } else if (searchType === "adminProduct" || searchType === "product") {
            const arr = [];
            board.forEach(el => {
                if (el[searchTypes[searchType].prop].indexOf(searchValue) !== -1) {
                    arr.push(el);
                }
            });
            setBoardList(arr);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "search":
                setSearchValue(value);
                break;
            default:
                break;
        }
    };

    const enterKeypress = (e) => {
        if (e.key === "Enter") {
            search();
        }
    };

    const { placeholder } = searchTypes[searchType];

    return (
        <Wrapper>
            <input
                type="text"
                placeholder={placeholder}
                name="search"
                value={searchValue}
                onChange={onChange}
                onKeyPress={enterKeypress}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: inline-block;
    position: relative;

    input {
        border: 1px solid #aaa;
        width: 250px;
        padding: 5px;
        border-radius: 5px;
    }

    i {
        position: absolute;   
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: #aaa;
        cursor: pointer;
    }
  `;

export default Searching;