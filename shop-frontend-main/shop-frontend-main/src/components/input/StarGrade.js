import React from 'react';
import styled from "styled-components";
import { useState } from 'react';

import { ReactComponent as Star } from 'assets/images/star.svg';

const StarGrade = ({ settingStar }) => {
    const [hoverIdx, setHoverIdx] = useState(0);
    const [clickIdx, setClickIdx] = useState(0);

    const fillStarIdx = (num, e) => {
        if (e === "enter" && hoverIdx >= num) {
            return "#ffd900";
        }
        if (e === "leave" && clickIdx >= num) {
            return "#ffd900";
        }
        return "#eeeeee";
    };

    const clickStarIdx = (num) => {
        setClickIdx(num);
        settingStar(num);
    }

    return (
        <StarView>
            <p>평점</p>
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    type="button"
                    onMouseEnter={() => setHoverIdx(num)}
                    onMouseLeave={() => setHoverIdx(0)}
                    onClick={() => {
                        clickStarIdx(num);
                    }}
                >
                    <Star
                        key={num}
                        fill={fillStarIdx(
                            num,
                            hoverIdx === 0 ? "leave" : "enter"
                        )}
                    />
                </button>
            ))}
        </StarView>
    );
};

const StarView = styled.div`
border: 1px solid #ddd;
    p{
        font-size: 14px;
        line-height: 1.8;
        padding: 0 5px;
        color: rgb(120,120,120);
    }
`


export default StarGrade;