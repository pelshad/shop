import React, { useState, useEffect } from 'react';

import { getAddress, addAddress, setDefaultAddress, deleteAddress } from 'api/user.js';

import { formatPhoneNumber } from 'utils/setPhoneNumber';

import Loading from 'components/loding/Loading';
import DaumPost from 'components/daumPost/DaumPost';
import SubTitle from 'components/myPage/SubTitle';

import * as Common from "assets/styleComponent/myPage/myPage";
import * as Style from "assets/styleComponent/myPage/address";

const Address = () => {
    const id = sessionStorage.getItem("userId");
    const [list, setList] = useState(null);
    const [shipName, setShipName] = useState("");
    const [shipAddress, setShipAddress] = useState("");
    const [shipPhone, setShipPhone] = useState("");
    const [shipReceiver, setShipReceiver] = useState("");
    const [showShipping, setShowShipping] = useState(false);
    const [insetAddress, setinsetAddress] = useState("");
    const [zoneCode, setZoneCode] = useState("");
    const [isPostOpen, setIsPostOpen] = useState(false);

    //배송지 추가
    const onSubmit = async (e) => {
        e.preventDefault();
        const regex = /^01([0|1|6|7|8|9])(\d{3}|\d{4})(\d{4})$/;

        if (shipName === "") {
            alert("배송지명 입력해주세요.");
            return
        } else if (insetAddress === "") {
            alert("주소 입력 해주세요.");
            return
        } else if (shipReceiver === "") {
            alert("받으실분 입력해주세요");
            return
        } else if (shipPhone === "") {
            alert("연락처 입력해주세요.");
            return
        } else if (!regex.test(shipPhone)) {
            alert("전화번호 형식이 맞지 않습니다.");
            return
        }

        const data = {
            user_id: id,
            ship_address: insetAddress,
            ship_detail_address: shipAddress,
            ship_name: shipName,
            ship_phone: shipPhone,
            ship_receiver: shipReceiver
        };

        addAddress(data, setShowShipping);
    }

    //배송지 삭제
    const delShpping = async (addrValue) => {
        const data = {
            i_addr: addrValue
        }
        deleteAddress(data);
    }

    //기본 배송지 설정
    const setDefaultAddr = async (addrValue) => {
        const data = {
            user_id: id,
            i_addr: addrValue
        }
        setDefaultAddress(data);
    }

    useEffect(() => {
        const data = {
            userId: sessionStorage.getItem('userId'),
            token: sessionStorage.getItem("token")
        };
        getAddress(data, setList);
    }, [])

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "shipName":
                setShipName(value);
                break;
            case "shipAddress":
                setShipAddress(value);
                break;
            case "shipPhone":
                setShipPhone(value);
                break;
            case "shipReceiver":
                setShipReceiver(value);
                break;
            default:
                break;
        }
    }

    return (
        list === null
            ? <Loading />
            : <Common.InDiv>
                <SubTitle h2={"배송지 관리"} h3={"배송지에 따라 상품유형 및 배송정보가 달라질 수 있습니다."} clickEvent={() => { setShowShipping(!showShipping) }} clickText={"+ 새 배송지 추가"} />

                {
                    //배송지 설정
                    showShipping &&
                    <Style.SettingAddress>
                        <form onSubmit={onSubmit}>
                            <h2>신규 배송지 추가</h2>
                            <ul>
                                <li>
                                    <label>
                                        <span>배송지명</span>
                                        <input type="text" name='shipName' onChange={onChange} />
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <span>
                                            주소
                                            <i className="fa-solid fa-magnifying-glass"
                                                onClick={() => {
                                                    setIsPostOpen(true);
                                                }}></i>
                                        </span>
                                        <div>
                                            <input
                                                type="text"
                                                readOnly
                                                value={insetAddress === "" ? "" : insetAddress}
                                                name='AddAddress'
                                                onClick={() => {
                                                    setIsPostOpen(true);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            />
                                            <input type="text" name='shipAddress' placeholder='상세주소' onChange={onChange} />
                                        </div>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <span>받으실분</span>
                                        <input type="text" name='shipReceiver' onChange={onChange} />
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <span>연락처</span>
                                        <input type="text" name='shipPhone' onChange={onChange} />
                                    </label>
                                </li>
                                <li>
                                    <button type='submit' >배송지 추가</button>
                                </li>
                            </ul>
                        </form>
                    </Style.SettingAddress>
                }

                {/* 배송지 리스트 */}
                <Style.Container>
                    <ul>
                        {
                            list.map((a, i) => {
                                return (
                                    <li key={i}>
                                        <h2>{a.ship_name} <span>{a.default_address === 1 ? "(기본배송지)" : ""}</span></h2>
                                        <p>
                                            {a.ship_address}
                                            {a.ship_detail_address === "" ? "" : ", " + a.ship_detail_address}
                                        </p>
                                        <p></p>
                                        <p>{a.ship_receiver}</p>
                                        <p>{formatPhoneNumber(a.ship_phone)} </p>
                                        <div className="buttons">
                                            <button onClick={() => { delShpping(a.i_addr) }}>배송지 삭제</button>
                                            {
                                                a.default_address !== 1
                                                    ? <button
                                                        className="setting"
                                                        onClick={() => {
                                                            setDefaultAddr(a.i_addr);
                                                        }}>
                                                        기본 배송지 설정
                                                    </button>
                                                    : null
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </Style.Container>

                {
                    // 우편
                    isPostOpen &&
                    <DaumPost
                        setIsPostOpen={setIsPostOpen}
                        setZoneCode={setZoneCode}
                        setAddress={setinsetAddress}
                    ></DaumPost>
                }
            </Common.InDiv >

    );
};
export default Address;