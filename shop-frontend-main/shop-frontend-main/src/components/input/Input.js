import React from 'react';
import styled from "styled-components";

const LoginInput = ({ type, name, value, placeholder, onChange, readOnly }) => {
    return (
        <Input type={type} name={name} value={value} placeholder={placeholder} onChange={onChange} readOnly={readOnly}></Input>
    );
};

const Input = styled.input`
    border: 1px solid #ddd;
    padding: 5px;
`;

export default LoginInput;