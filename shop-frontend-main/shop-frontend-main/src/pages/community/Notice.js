import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getBoard } from 'api/board.js';

import adminCheck from 'utils/adminCheck'

import Pageing from 'components/board/Pageing';
import Loading from 'components/loding/Loading';
import Searching from 'components/board/Searching';

import * as Style from "assets/styleComponent/community/notice";

const Notice = () => {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { boardPage } = useParams();
    const [boardList, setBoardList] = useState(null);

    // 게시글가져오기
    useEffect(() => {
        const data = {
            boardPage: boardPage,
            boardType: "notice"
        }
        if (searchParams.get("search") !== null) {
            data.search = searchParams.get("search");
        }
        setBoardList(null);
        getBoard(data, setBoardList);
    }, [nav, searchParams.get("search")])

    return (
        boardList === null
            ? <Loading />
            : <Style.Contaienr>
                <div className="wrap">
                    <h2>공지사항</h2>

                    <div className="flexBox">
                        <Searching board={boardList.list} setBoardList={setBoardList} searchType={"notice"} />
                        {adminCheck(false) && <Link className='write' to={"/community/write"}>글쓰기</Link>}

                    </div>
                    <Style.Board>
                        <ul className='title'>
                            <li>번호</li>
                            <li>제목</li>
                            <li>글쓴이</li>
                            <li>작성일</li>
                            <li>조회수</li>
                        </ul>
                        {
                            boardList.list.length > 0
                                ? boardList.list.map((a, i) => {
                                    return (
                                        <ul key={i} className='list'>
                                            <li>{a.i_board}</li>
                                            <li><Link to={`/community/noticeDetail/${a.i_board}`}>{a.title}</Link></li>
                                            <li>{a.user_id}</li>
                                            <li>{a.create_date}</li>
                                            <li>{a.view_up}</li>
                                        </ul>
                                    )
                                })
                                : <p>등록된 게시글이 없습니다</p>
                        }
                    </Style.Board>

                    {
                        boardList.list.length > 0 &&
                        <Pageing boardPage={boardPage} boardLength={boardList?.count.page_count} url={"/community/notice"} />
                    }
                </div>
            </Style.Contaienr>
    );
};

export default Notice;