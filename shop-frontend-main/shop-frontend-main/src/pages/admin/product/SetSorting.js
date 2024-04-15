import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductSelect from 'components/admin/product/input/Select';

import { getCategory } from 'api/category';
import { getProduct, setProudctManualSorting, setProudctSorting } from 'api/product';

import * as Common from "assets/styleComponent/admin/common"
import * as Style from "assets/styleComponent/admin/product/sorting"

const SetSorting = () => {
    const [cate01, setCate01] = useState("");
    const [cate02, setCate02] = useState("");
    const [firstCategory, setFirstCategory] = useState([]);
    const [secondCategory, setSecondCategory] = useState([]);
    const [sorting, setSorting] = useState("선택해주세요");
    const [productList, setProductList] = useState(null);
    const [sortingNum, setSortingNum] = useState(null);

    useEffect(() => {
        getCategory(setFirstCategory);
    }, [])

    useEffect(() => {
        // 카테고리 1번 선택하면 2번에 카테고리 1번 하위 카테고리 가져오기
        for (let i = 0; i < firstCategory.length; i++) {
            if (firstCategory[i].cate_code === Number(cate01)) {
                setSecondCategory(firstCategory[i].lowCategory);
            }
        }
    }, [cate01])

    // 상품리스트 정렬번호 있으면 저장해서 가져오기
    useEffect(() => {
        if (productList !== null) {
            let arr = [];
            for (let i = 0; i < productList[0]?.length; i++) {
                arr.push({
                    goods_rank: productList[0][i].goods_rank === undefined
                        ? null
                        : productList[0][i].goods_rank,
                    goods_code: productList[0][i]?.goods_code
                });
            }
            setSortingNum(arr);
        }
    }, [productList])

    // 정렬 저장
    const onSubmit = (e) => {
        e.preventDefault();

        if (cate01 === "선택해주세요" || cate01 === "") {
            alert("카테고리 1번 선택해주세요");
            return;
        }

        const data = {
            cate_code: cate02 === "" || cate02 === "선택해주세요" ? cate01 : cate02,
        }

        switch (sorting) {
            case "판매량 많은 순":
                data.sort_type = "goods_sell";
                data.direction = "desc";
                break;
            case "판매량 적은 순":
                data.sort_type = "goods_sell";
                data.direction = "asc";
                break;
            case "재고 많은 순":
                data.sort_type = "goods_stock";
                data.direction = "desc";
                break;
            case "재고 적은 순":
                data.sort_type = "goods_stock";
                data.direction = "asc";
                break;
            case "수동선택":
                data.sort_type = "goods_rank";
                getProduct(data, setProductList);
                break;

            default:
                break;
        }

        if (sorting !== "수동선택") {
            setProudctSorting(data);
        }
    }

    // 상품 수동정렬 순서 저장
    const onSave = async (e) => {
        e.preventDefault();
        const arr = sortingNum;
        sortingNum.forEach((el, i) => {
            if (el.goods_rank === "" || el.goods_rank === null) {
                arr[i].goods_rank = "N";
            }
        });

        const saveCheck = await setProudctManualSorting({
            cate_code: cate02 === "" || cate02 === "선택해주세요" ? cate01 : cate02,
            sorting_data: arr
        });

        if (saveCheck === "ok") {
            alert("저장 완료");
        } else {
            alert("알 수 없는 에러로 저장을 실패했습니다.");
        }
    }

    const onChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        switch (name) {
            case "firstCategory":
                setCate01(value);
                setCate02("");
                setSecondCategory([]);
                break;
            case "secondCategory":
                setCate02(value);
                break;
            case "sorting":
                setSorting(value);
                break;

            default:
                break;
        }
    };

    const onSortingChange = (e) => {
        let arr = [...sortingNum];
        const dataNum = e.target.dataset.num;
        const value = e.target.value;
        const name = e.target.name;
        switch (name) {
            case "sortingNum":
                arr[dataNum].goods_rank = value;
                break;

            default:
                break;
        }

        setSortingNum(arr);
    }

    return (
        <>
            <Common.Container>
                <Style.H2>정렬 설정</Style.H2>
                <ProductSelect title="카테고리 1번" type="text" name="firstCategory" placeholder="상품이름" onChange={onChange} option={firstCategory} value={cate01} />
                <ProductSelect title="카테고리 2번" type="text" name="secondCategory" placeholder="상품이름" onChange={onChange} option={secondCategory} value={cate02} />
                <Style.Box>
                    <span>정렬방식 선택</span>
                    <div>
                        <div>
                            <select name="sorting" onChange={onChange}>
                                <option value="선택해주세요">선택해주세요</option>
                                <option value="판매량 많은 순">판매량 많은 순</option>
                                <option value="판매량 적은 순">판매량 적은 순</option>
                                <option value="재고 많은 순">재고 많은 순</option>
                                <option value="재고 적은 순">재고 적은 순</option>
                                <option value="수동선택">수동선택</option>
                            </select>
                            <i className="fa-solid fa-sort-down"></i>
                        </div>
                        {
                            sorting === "선택해주세요"
                                ? null
                                : sorting === "수동선택"
                                    ? <div className='buttons'>
                                        <button onClick={onSubmit}>리스트 불러오기</button>
                                        <button onClick={onSave}>정렬 저장</button>
                                    </div>
                                    : <button onClick={onSubmit}>저장</button>
                        }

                    </div>
                </Style.Box>
            </Common.Container>
            {
                productList !== null && sortingNum !== null &&
                <Common.Container>
                    <Style.Title>
                        <li>상품 명</li>
                        <li>정렬 순서</li>
                    </Style.Title>
                    {
                        productList !== "not product"
                            ? productList[0].map((a, i) => {
                                return <Style.List key={i}>
                                    <li>{a.goods_nm}</li>
                                    <li><input type="text" data-num={i} name="sortingNum" value={sortingNum[i]?.goods_rank} onChange={onSortingChange} /></li>
                                </Style.List>
                            })
                            : <p>해당 카테고리는 상품이 없습니다</p>
                    }
                </Common.Container>
            }
        </>
    );
};

export default SetSorting;