import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getUserList, deleteUser } from 'api/user.js';

import { formatPhoneNumber } from 'utils/setPhoneNumber';

import Searching from 'components/board/Searching';
import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';
import Pageing from 'components/board/Pageing';

import * as Style from 'assets/styleComponent/admin/user/user';
import * as Common from 'assets/styleComponent/admin/common';

const UserList = () => {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { boardPage } = useParams();
    const [board, setBoard] = useState(null);

    // 회원 삭제
    const userDelete = async (index) => {
        deleteUser({ user_id: board.list[index].user_id });
    }

    // 회원 리스트 가져오기
    const getUser = async () => {
        const data = {
            boardPage: boardPage,
            boardType: "user"
        }
        if (searchParams.get("search") !== null) {
            data.search = searchParams.get("search");
        }
        getUserList(data, setBoard);
    }

    useEffect(() => {
        getUser();
    }, [nav, searchParams.get("search")])

    return (
        board === null
            ? <Loading />
            : <>
                <Top title={"회원 관리"} isButton={false} />
                <Common.Padding>
                    <Common.Container>
                        <Searching board={board.list} setBoardList={setBoard} searchType={"user"} />
                    </Common.Container>
                    {
                        board.list.map((a, i) => {
                            return (
                                <Common.Container key={i} style={{ textAlign: "center" }}>
                                    <Style.Div>
                                        <ul>
                                            <li>아이디 : {a.user_id}</li>
                                            <li>이메일 : {a.user_email}</li>
                                            <li>이름 : {a.user_nm}</li>
                                            <li>연락처 : {formatPhoneNumber(a.user_tel)}</li>
                                            <li>주소 : {a.user_addr}</li>
                                            <li>가입일자 : {a.user_insdate}</li>
                                        </ul>
                                    </Style.Div>
                                    <Style.DeleteButton onClick={() => { userDelete(i) }}>회원 삭제</Style.DeleteButton>
                                </Common.Container>
                            )
                        })
                    }
                </Common.Padding>
                <Pageing boardPage={boardPage} boardLength={board.count.page_count} url={"/admin/user"} />
            </>
    );
};

export default UserList;