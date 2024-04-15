import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LinkButton = ({ link, title }) => {
    return (
        <Div>
            <Link to={link}>{title}</Link>
        </Div>
    );
};

const Div = styled.div`
    a{
        line-height: 30px;
        background-color: #1a6dff;
        color: #fff;
        padding: 0px 15px;
        border-radius: 5px;
    }
`

export default LinkButton;