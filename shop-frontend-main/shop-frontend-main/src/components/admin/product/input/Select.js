import React from 'react';
import styled from "styled-components";

const ProductSelect = ({ title, type, name, placeholder, onChange, option, value }) => {
    return (
        <Label>
            <span>{title}</span>
            <div>
                <select type={type} name={name} placeholder={placeholder} onChange={onChange} value={value}>
                    <option value="선택해주세요">선택해주세요</option>
                    {
                        option?.map((a, i) => {
                            return (
                                <option key={i} value={a.cate_code}>{a.cate}</option>
                            )
                        })
                    }
                </select>
                <i className="fa-solid fa-sort-down"></i>
            </div>
        </Label >
    );
};

const Label = styled.label`
    display: flex;
    align-items: center;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    span{
        display: inline-block;
        width: 150px;
    }
    > div{
        position: relative;
    }
    select{
        border: 1px solid #ccc;
        border-radius: 5px;
        line-height: 30px;
        padding: 0px 10px;
        width: 300px;
        color: #757575;
    }
    i{
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-70%);
        color: #757575;
    }
`;

export default ProductSelect;