import React from 'react';
import styled from "styled-components";

const ProductInput = ({ title, type, name, placeholder, onChange, value }) => {
    return (
        <Label>
            <span>{title}</span>
            <input type={type} name={name} placeholder={placeholder} onChange={onChange} value={value} />
        </Label>
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
    input{
        border: 1px solid #ccc;
        border-radius: 5px;
        line-height: 30px;
        padding: 0px 10px;
        width: 300px;
    }
`;
export default ProductInput;