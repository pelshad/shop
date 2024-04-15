import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getDetailBoard, deleteBoard } from 'api/board.js';

import adminCheck from 'utils/adminCheck';

import Loading from 'components/loding/Loading';

import * as Style from "assets/styleComponent/community/detail";

const NoticeDetail = () => {
    const { boardPage } = useParams();
    const nav = useNavigate();
    const [readDetail, setReadDetail] = useState(null);

    // 게시글 삭제
    const boardDel = async () => {
        const data = {
            type: "notice",
            i_board: readDetail.detail.i_board,
        }
        deleteBoard(data);
    }

    // 게시글 상세 정보 가져오기
    useEffect(() => {
        const data = {
            i_board: boardPage,
            boardType: "notice",
        }
        getDetailBoard(data, setReadDetail);
    }, [nav])

    return (
        readDetail === null
            ? <Loading />
            : <Style.Detail>
                <div className="wrap">
                    <h2>공지사항</h2>

                    <div className="title">
                        <ul>
                            <li>
                                <div>제목</div>
                                <div>{readDetail.detail.title}</div>
                            </li>
                            <li>
                                <div>작성자</div>
                                <div>{readDetail.detail.user_id}</div>
                            </li>
                        </ul>
                        <div>
                            <p><b>작성일</b>{readDetail.detail.create_date}</p>
                            <p><b>조회수</b>{readDetail.detail.view_up}</p>
                        </div>
                    </div>

                    <div className="content">
                        <p dangerouslySetInnerHTML={{ __html: readDetail.detail.content }}></p>
                    </div>

                    <Link to="/community/notice/1" className="more">목록</Link>
                    {adminCheck(false) && <button onClick={boardDel}>삭제</button>}

                    <div className="differentBoard">
                        <ul>
                            <li>
                                <div>다음글</div>
                                <div>
                                    <Link to={
                                        readDetail.next.length <= 0
                                            ? null
                                            : `/community/noticeDetail/${Number(readDetail.next[0].i_board)}`
                                    }>
                                        {
                                            readDetail.next.length <= 0
                                                ? "다음글이없습니다."
                                                : readDetail.next[0].title
                                        }
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div>이전글</div>
                                <div>
                                    <Link to={
                                        readDetail.pre.length <= 0
                                            ? null
                                            : `/community/noticeDetail/${Number(readDetail.pre[0].i_board)}`
                                    }>
                                        {
                                            readDetail.pre.length <= 0
                                                ? "이전글이없습니다."
                                                : readDetail.pre[0].title
                                        }
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Style.Detail>
    );
};

export default NoticeDetail;