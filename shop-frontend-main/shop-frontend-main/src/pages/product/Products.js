import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { getProduct } from 'api/product';

import { comma } from 'utils/commaReplace';

import Loading from 'components/loding/Loading';
import Searching from 'components/board/Searching';
import Pageing from 'components/board/Pageing';

import * as Style from "assets/styleComponent/product/products";

import banner from "assets/images/shop/banner.jpg";
import noImg from "assets/images/noImg.gif";

const Products = () => {
    const COUNT = 12;
    const nav = useNavigate();
    const { categoryCode, boardPage } = useParams();
    const [productList, setProductList] = useState(null);
    const [copyList, setCopyList] = useState(null);

    const [select, setSelect] = useState("기본순");

    useEffect(() => {
        getProduct({ cate_code: categoryCode }, setProductList);
    }, [categoryCode])

    // 상품 날짜순 정렬
    const compareDates = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (select === "최신순") {
            if (dateA < dateB) {
                return 1;
            } else if (dateA > dateB) {
                return -1;
            } else {
                return 0;
            }
        } else if (select === "오래된순") {
            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    // 상품 총 정렬
    const sortData = () => {
        if (select === "기본순") {
            reset();
        } else if (select === "비싼 가격순") {
            const sorted = [...copyList].sort((a, b) => Number(b.goods_price) - Number(a.goods_price));
            setCopyList(sorted);
        } else if (select === "낮은 가격순") {
            const sorted = [...copyList].sort((a, b) => Number(a.goods_price) - Number(b.goods_price));
            setCopyList(sorted);
        } else {
            const sorted = [...copyList].sort(compareDates);
            setCopyList(sorted);
        }
    }

    // 상품 리스트 복사
    const reset = () => {
        if (productList !== "not product") {
            setCopyList(productList[0]);
        } else {
            setCopyList(productList);
        }
    }

    // 상품 정렬
    useEffect(() => {
        if (productList?.length > 0) {
            sortData();
        }
    }, [select]);

    // 상품 리셋 
    useEffect(() => {
        if (productList !== null) {
            reset();
        }
    }, [productList, categoryCode]);

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "select":
                setSelect(value);
                break;
            default:
                break;
        }
    }

    return (
        copyList === null
            ? <Loading />
            : <div style={{ paddingBottom: "50px", }}>
                <Style.Products>
                    <div className='wrap'>
                        <div className="banner">
                            <img src={banner} alt="" />
                        </div>
                        <div className="flexBox" style={{ paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
                            <Searching board={productList[0]} setBoardList={setCopyList} searchType={"product"} reset={reset} />
                            <Style.Select>
                                <select name="select" onChange={onChange}>
                                    <option value="기본순">기본순</option>
                                    <option value="최신순">최신순</option>
                                    <option value="오래된순">오래된순</option>
                                    <option value="비싼 가격순">비싼 가격순</option>
                                    <option value="낮은 가격순">낮은 가격순</option>
                                </select>
                                <i className="fa-solid fa-sort-down"></i>
                            </Style.Select>
                        </div>
                        {
                            productList !== "not product" && copyList !== "not product" ?
                                <ul>
                                    {
                                        copyList?.slice((boardPage - 1) * COUNT, (boardPage * COUNT)).map((a, i) => {
                                            return (
                                                <li key={i}>
                                                    <Link to={`/product/detail/${a.goods_code}`}>
                                                        <img src={a.goods_img === "" ? noImg : a.goods_img} alt="" />
                                                        <h3>{a.goods_nm}</h3>
                                                        <h4>{comma(a.goods_price)} 원</h4>
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                : <p style={{ textAlign: "center", lineHeight: "200px", fontSize: "18px" }}>등록된 상품이 없습니다.</p>
                        }
                    </div>
                </Style.Products>
                {
                    productList !== "not product" && copyList !== "not product" &&
                    <Pageing count={COUNT} boardPage={boardPage} boardLength={copyList?.length} url={`/product/products/${categoryCode}`} />
                }
            </div>
    );
};

export default Products;