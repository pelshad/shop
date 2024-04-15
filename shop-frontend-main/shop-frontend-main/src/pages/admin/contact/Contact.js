import React, { useEffect, useState } from 'react';

import { getRoom } from 'api/chat';

import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';

import * as Style from "assets/styleComponent/admin/chat/chat";
import * as Common from "assets/styleComponent/admin/common";

const Contact = () => {
    const [room, setRoom] = useState(null);

    useEffect(() => {
        getRoom(setRoom);
    }, [])

    return (
        room === null
            ? <Loading />
            : <>
                <Top title={"1:1 문의 관리"} isButton={false} />
                <Common.Padding>
                    {
                        room.map((a, i) => {
                            return (
                                <Common.Container key={i} style={a.check_yn === "N" ? { backgroundColor: "#ff545459" } : null}>
                                    <Style.ChatList to={a.CID}>
                                        <h2>{a.user_id}님의 문의 요청</h2>
                                        <h3>{a.cre_date}</h3>
                                    </Style.ChatList>
                                </Common.Container>
                            )
                        })
                    }
                </Common.Padding>
            </>
    );
};

export default Contact;