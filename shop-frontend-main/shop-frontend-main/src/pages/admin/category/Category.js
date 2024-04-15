import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import { getCategory, addCategory } from 'api/category.js';

import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';
import Register from './Register';

import * as Style from "assets/styleComponent/admin/category/category";
import * as Common from "assets/styleComponent/admin/common";

const Category = () => {
    const nav = useNavigate();
    const [category, setCategory] = useState(null);
    const [categorys, setCategorys] = useState(null);

    // 기존 카테고리 가져오기
    useEffect(() => {
        getCategory(setCategorys);
    }, []);

    // 상위 카테고리 생성
    const createCategory = () => {
        let arr = categorys;
        let index = categorys.length + 1;
        setCategorys([...arr, { cate_code: index * 10, cate: category, lowCategory: [] }]);
        setCategory("");
        nav("/admin/Category");
    }

    // 하위 카테고리 생성
    const createLowCategory = (index) => {
        let arr = categorys;
        arr[index].lowCategory.push({
            cate_code: (arr[index].cate_code * 100) + ((arr[index].lowCategory.length + 1) * 10),
            cate: category
        });
        setCategorys([...arr]);
        setCategory("");
        nav("/admin/Category");
    };

    // 상위 카테고리 삭제
    const deleteCategory = (index) => {
        let arr = categorys;
        arr.splice(index, 1);
        for (let i = 0; i < arr.length; i++) {
            const idx = i + 1;
            arr[i].cate_code = idx * 10;
            if (arr[i].lowCategory.length > 0) {
                for (let j = 0; j < arr[i].lowCategory.length; j++) {
                    arr[i].lowCategory[j].cate_code = (idx * 1000) + ((j + 1) * 10);
                };
            };
        };
        setCategorys([...arr]);
    };

    // 하위 카테고리 삭제
    const deleteLowCategory = (index, lowIndex) => {
        let arr = categorys;
        arr[index].lowCategory.splice(lowIndex, 1);
        if (arr[index].lowCategory.length > 0) {
            for (let i = 0; i < arr[index].lowCategory.length; i++) {
                arr[index].lowCategory[i].cate_code = ((arr[index].cate_code) * 100) + ((i + 1) * 10);
            }
        }
        setCategorys([...arr]);
    };

    // 상위 카테고리 수정
    const updateCategory = (index) => {
        let arr = categorys;
        arr[index].cate = category;
        setCategory("");
        nav("/admin/Category");
    };

    // 하위 카테고리 수정
    const updateLowCategory = (index, lowIndex) => {
        let arr = categorys;
        arr[index].lowCategory[lowIndex].cate = category;
        setCategory("");
        nav("/admin/Category");
    };

    // 카테고리 저장
    const onSubmit = async (e) => {
        e.preventDefault();
        addCategory(categorys);
    };

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "registerCate":
                setCategory(value);
                break;
            default:
                break;
        };
    };

    return (
        categorys === null
            ? <Loading />
            : <>
                <Top title={"카테고리"} isButton={true} buttonTitle={"카테고리 추가"} buttonLink={"registerCate"} />
                <Style.Save onClick={onSubmit}>저장</Style.Save>
                <Common.Padding>
                    {
                        categorys.map((a, i) => {
                            return (
                                <Common.Container key={i}>
                                    <Style.Flex>
                                        <Style.CateInfo>
                                            <li>분류코드 : {a.cate_code}</li>
                                            <li>카테고리명 : {a.cate}</li>
                                        </Style.CateInfo>
                                        <Style.Buttons>
                                            <Link to={`registerLowCate?index=${i}`}>추가</Link>
                                            <button onClick={() => { deleteCategory(i) }}>삭제</button>
                                            <Link to={`updateCate?index=${i}`}>수정</Link>
                                        </Style.Buttons>
                                    </Style.Flex>
                                    {
                                        a.lowCategory?.map((b, j) => {
                                            return (
                                                <Common.Container key={j}>
                                                    <Style.Flex>
                                                        <Style.CateInfo>
                                                            <li>분류코드 : {b.cate_code}</li>
                                                            <li>카테고리명 : {b.cate}</li>
                                                        </Style.CateInfo>
                                                        <Style.Buttons>
                                                            <button onClick={() => { deleteLowCategory(i, j) }}>삭제</button>
                                                            <Link to={`updateLowCate?index=${i}&lowIndex=${j}`}>수정</Link>
                                                        </Style.Buttons>
                                                    </Style.Flex>
                                                </Common.Container>
                                            )
                                        })
                                    }
                                </Common.Container>
                            )
                        })
                    }
                </Common.Padding>

                <Routes>
                    <Route path="registerCate" element={
                        <Register onChange={onChange} category={createCategory} title="카테고리 추가" />
                    }></Route>
                    <Route path="registerLowCate" element={
                        <Register onChange={onChange} category={createLowCategory} title="하위 카테고리 추가" />
                    }></Route>
                    <Route path="updateCate" element={
                        <Register onChange={onChange} category={updateCategory} title="카테고리 수정" />
                    }></Route>
                    <Route path="updateLowCate" element={
                        <Register onChange={onChange} category={updateLowCategory} title="하위 카테고리 수정" />
                    }></Route>
                </Routes>
            </>
    );
};



export default Category;