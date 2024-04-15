import React from 'react';
import styled from "styled-components";
import TextEditor from 'components/editor/Editor';

const Textarea = ({ title, setProductContent, setImageCode, type, value }) => {
    return (
        <Div>
            <span>{title}</span>
            <TextEditor setContent={setProductContent} setImageCode={setImageCode} width={700} type={type} value={value} ></TextEditor>
        </Div>
    );
};

const Div = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    span{
        display: inline-block;
        width: 150px;
    }
    textarea{
        border: 1px solid #ccc;
        border-radius: 5px;
        line-height: 30px;
        padding: 0px 10px;
        width: 80%;
        height: 300px;
        resize: none;;
    }
`;

export default Textarea;