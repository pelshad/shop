import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

/**
 * @param {number} count 페이지 표시되는 게시글
 * @param {number} boardPage 현재 페이지
 * @param {number} boardLength 게시글 총 갯수
 * @param {string} url 이동할 페이지 위치
 * @returns 
 */
const Paging = ({ count, boardPage, boardLength, url }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const nowPage = Number(boardPage);
    const minPage = 1;
    const maxPage = count !== undefined ? Math.ceil(boardLength / count) : boardLength;
    const minNav = Math.max(nowPage - 2, minPage);
    const maxNav = Math.min(nowPage + 2, maxPage);
    const totalNav = 5;

    const pageNumbers = useMemo(() => {
        const pageArr = [];
        let startPage = minNav;

        if (nowPage === minPage) {
            startPage = minPage;
        } else if (nowPage === minPage + 1) {
            startPage = minPage;
        } else if (nowPage >= maxPage - 1) {
            startPage = Math.max(maxPage - totalNav + 1, minPage);
        }

        for (let i = startPage; i <= Math.min(startPage + totalNav - 1, maxPage); i++) {
            pageArr.push(i);
        }

        return pageArr;
    }, [nowPage, minNav, maxNav, minPage, maxPage, totalNav]);

    return (
        <PagingContainer>
            <ul>
                {
                    searchParams.get("search") === null
                        ? <li>
                            <Link to={`${url}/1`}>
                                <i className="fa-solid fa-angles-left"></i>
                            </Link>
                        </li>
                        : <li>
                            <Link to={`${url}/1?search=${searchParams.get("search")}`}>
                                <i className="fa-solid fa-angles-left"></i>
                            </Link>
                        </li>
                }
                {
                    pageNumbers.map((page) => (
                        searchParams.get("search") === null
                            ? <li key={page}>
                                <Link
                                    to={`${url}/${page}`}
                                    className={page === nowPage ? 'now' : ''}
                                >
                                    {page}
                                </Link>
                            </li>
                            : <li key={page}>
                                <Link
                                    to={`${url}/${page}?search=${searchParams.get("search")}`}
                                    className={page === nowPage ? 'now' : ''}
                                >
                                    {page}
                                </Link>
                            </li>
                    ))
                }
                {
                    searchParams.get("search") === null
                        ? <li>
                            <Link to={`${url}/${maxPage}`}>
                                <i className="fa-solid fa-angles-right"></i>
                            </Link>
                        </li>
                        : <li>
                            <Link to={`${url}/${maxPage}?search=${searchParams.get("search")}`}>
                                <i className="fa-solid fa-angles-right"></i>
                            </Link>
                        </li>
                }
            </ul>
        </PagingContainer >
    );
};

export const PagingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0px;

    ul {
        display: flex;
        gap: 10px;
    }

    ul li a {
        background-color: #aaa;
        color: #fff;
        border-radius: 5px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ul li a.now {
        background-color: #1a6dff;
    }
`;

export default Paging;