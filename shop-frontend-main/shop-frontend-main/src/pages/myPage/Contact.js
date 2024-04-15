import React, { useEffect, useRef, useState } from 'react';

import { getMessage, updateMessage } from 'api/chat';

import createCode from 'utils/createCode';

import SubTitle from 'components/myPage/SubTitle';
import Loading from 'components/loding/Loading';
import ImageUpload from 'components/input/ImageUpload';

import * as Common from "assets/styleComponent/myPage/myPage";
import * as Style from 'assets/styleComponent/myPage/contact';

const Contact = () => {
    const chatContentRef = useRef(null);
    const inputRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [sendMessage, setSendMessage] = useState("");
    const [resIndex, setResIndex] = useState(0);
    const [newMessage, setNewMessage] = useState(0);
    const [image, setImage] = useState("");
    const [isNewMessage, setIsNewMessage] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSend, setIsSend] = useState(true);
    const [isBottom, setIsBottom] = useState(true);
    const [isReading, setIsReading] = useState(true);

    // 슆+엔터 개행
    // 엔터 메시지 보내기
    const onKeyPress = (e) => {
        if (e.code === "Enter" && e.shiftKey) {
            return;
        } else if (e.code === "Enter") {
            e.preventDefault();
            onSubmit();
        }
    }

    // 메시지 보내기
    const onSubmit = async () => {
        // 두번씩 메시지 보내는거 방지
        if (isSubmit) {
            return;
        }

        setIsSubmit(true);

        const replacedContent = sendMessage.replace(/\n/g, "<br>");
        const data = {
            user_id: sessionStorage.getItem("userId"),
            content: replacedContent,
            stat: "req"
        }

        if (message.length === 0) {
            data.CID = createCode();
        } else {
            data.CID = message[0].CID;
        }

        // 이미지 크기 확인   1326979 = 1메가
        if (image !== "") {
            if (image.length > 2653958) {
                alert("이미지는 2메가 미만 등록가능합니다.");
                setIsSubmit(false);
                return;
            }
        }

        // 이미지 체크
        if (sendMessage !== "") {
            await updateMessage(data);
            if (image !== "") {
                data.content = `<img src="${image}" alt="" />`
                await updateMessage(data);
                setImage("");
            }
        } else {
            if (image !== "") {
                data.content = `<img src="${image}" alt="" />`
                await updateMessage(data);
                setImage("");
            }
        }

        setSendMessage("");

        inputRef.current.focus();

        await getMessage({ user_id: sessionStorage.getItem("userId") }, setMessage, setIsSend);

        setIsSubmit(false);
    }

    // 스크롤 하단 시작
    const scrollBottomStart = () => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            setIsNewMessage(true);
        }
    }

    // 메시지 오면 알림뜸
    const newMessageCheck = () => {
        if (chatContentRef.current.scrollTop !== chatContentRef.current.scrollHeight - chatContentRef.current.clientHeight) {
            setIsNewMessage(false);
        } else {
            setIsNewMessage(true);
        }

        if (isNewMessage === true) {
            setNewMessage(opponentMessage());
        }
    }

    // 상대가 보낸 메시지 갯수
    const opponentMessage = () => {
        let messageLength = 0;

        for (let i = 0; i < message.length; i++) {
            if (message[i].stat === "res") {
                messageLength++;
            }
        }

        return messageLength;
    }

    // 시간 추출
    const formetTime = (date) => {
        const dateString = date;
        const timeString = dateString.split(" ")[1];
        const [hours, minutes] = timeString.split(":");
        return hours + ":" + minutes;
    }

    // 백엔드에서 준 데이터 가공
    const factoryData = () => {
        const copy = message
        const arr = [];
        const groupedData = {};

        // 날짜를 기준으로 데이터 배열을 그룹화
        for (let i = 0; i < copy.length; i++) {
            const item = copy[i];
            const date = item.send_date.split(' ')[0]; // 시간 부분 제외하고 날짜만 추출

            if (!groupedData[date]) {
                groupedData[date] = [];
            }

            groupedData[date].push(item);
        }

        // 그룹화된 데이터를 날짜순으로 정렬
        const sortedDates = Object.keys(groupedData).sort(function (a, b) {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        // 정렬된 날짜 순서에 따라 데이터를 출력
        for (let j = 0; j < sortedDates.length; j++) {
            const sortedDate = sortedDates[j];
            const sortedItems = groupedData[sortedDate];

            arr.push({
                days: sortedDate,
                message: sortedItems
            })
        }

        return arr;
    }

    useEffect(() => {
        getMessage({ user_id: sessionStorage.getItem("userId") }, setMessage);
    }, [])

    useEffect(() => {
        if (message !== null && isBottom === true) {
            scrollBottomStart();
            setIsBottom(false);
        }

        // 채팅중일때 메시지오면 바로 스크롤 하단으로 내리기
        if (isReading) {
            if (message !== null && opponentMessage() !== newMessage) {
                scrollBottomStart();
            }
        }
    })

    // 채팅 보내면 바로 스크롤 하단으로
    useEffect(() => {
        if (isSend === false) {
            setIsSend(true);
            scrollBottomStart();
        }
    }, [isSend])

    // 실시간 통신
    useEffect(() => {
        const interval = setInterval(() => {
            setResIndex(i => i + 1);

            // 채팅중인지 아닌지 체크
            if (chatContentRef.current) {
                if (chatContentRef.current.scrollTop !== chatContentRef.current.scrollHeight - chatContentRef.current.clientHeight) {
                    setIsReading(false);
                } else {
                    setIsReading(true);
                }
            }

            getMessage({ user_id: sessionStorage.getItem("userId") }, setMessage);
        }, 1000 * 10);

        return () => {
            clearInterval(interval);
        };
    }, [])

    useEffect(() => {
        if (resIndex >= 300) {
            window.location.reload();
        }
    }, [resIndex]);


    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "message":
                setSendMessage(value);
                break;

            default:
                break;
        }
    }

    return (
        message === null
            ? <Loading />
            : <Common.InDiv>
                <SubTitle h2={"고객 문의"} h3={"문의 주시면 빠른 시간내에 답변 해드리겠습니다."} clickText={<><i className="fa-solid fa-comment-dots"></i>문의하기</>} />
                <Style.ChatContainer>
                    <div className='dayGroup' ref={chatContentRef} onScroll={newMessageCheck}>
                        {
                            factoryData().map((a, i) => {
                                return (
                                    <ul key={i}>
                                        <li className='day'>
                                            <h2>{a.days}</h2>
                                        </li>
                                        {
                                            a.message.map((b, j) => {
                                                return (
                                                    <li key={j} className={b.stat === "res" ? "left" : "right"}>
                                                        <div>{formetTime(b.send_date)}</div>
                                                        <p dangerouslySetInnerHTML={{ __html: b.content }}></p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                )
                            })
                        }

                        {
                            chatContentRef.current &&
                            chatContentRef.current.scrollTop !== 0 &&
                            opponentMessage() !== newMessage &&
                            <span className='newMessage' onClick={scrollBottomStart}>새로운 메시지 도착</span>
                        }
                    </div>
                    <div className="send" >
                        {
                            image !== "" &&
                            <div className='images'>
                                <img src={image} alt="" />
                            </div>
                        }
                        <textarea name="message" value={sendMessage} onChange={onChange} ref={inputRef} onKeyPress={onKeyPress} />
                        <label>
                            <span>
                                <i className="fa-solid fa-camera"></i>
                            </span>
                            <ImageUpload setImageData={setImage} />
                        </label>
                        <button onClick={onSubmit}>전송</button>
                    </div>
                </Style.ChatContainer>
            </Common.InDiv >
    );
};

export default Contact;