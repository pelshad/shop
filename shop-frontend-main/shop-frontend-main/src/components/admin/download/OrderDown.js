import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as XLSX from 'xlsx/xlsx.mjs';
import * as saveAs from "file-saver";

import { downOrderList } from 'api/order.js';

const Download = () => {
    const [list, setList] = useState();

    let today = new Date();

    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);

    let dateString = year + '-' + month + '-' + day;

    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const excelFileName = '주문리스트 ' + dateString;

    const excelDownload = (excelData) => {
        const ws = XLSX.utils.aoa_to_sheet([
            ['주문번호', '주문완료', '유저ID', '결제방식', '상품번호', '상품명', '할인율', '금액', '주문일자', '구매자', '주소', '연락처', '개수', '택배사', '송장번호', '받는 사람', '취소 및 환불', '취소 및 환불 일자', '구매확정', '리뷰']
        ]);

        excelData.map((data) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [
                        data.주문번호,
                        data.주문완료,
                        data.유저ID,
                        data.결제방식,
                        data.상품번호,
                        data.상품명,
                        data.할인율,
                        data.금액,
                        data.주문일자,
                        data.구매자,
                        data.주소,
                        data.연락처,
                        data.개수,
                        data.택배사,
                        data.송장번호,
                        data.받는사람,
                        data.취소및환불,
                        data.취소및환불일자,
                        data.구매확정,
                        data.리뷰
                    ]
                ],
                { origin: -1 }
            );
            ws['!cols'] = [
                { wpx: 90 },
                { wpx: 52 },
                { wpx: 67 },
                { wpx: 52 },
                { wpx: 107 },
                { wpx: 100 },
                { wpx: 41 },
                { wpx: 67 },
                { wpx: 117 },
                { wpx: 67 },
                { wpx: 333 },
                { wpx: 113 },
                { wpx: 33 },
                { wpx: 80 },
                { wpx: 120 },
                { wpx: 71 },
                { wpx: 80 },
                { wpx: 100 },
                { wpx: 52 },
                { wpx: 47 }
            ]
            return false;
        });
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelFile = new Blob([excelButter], { type: excelFileType });
        saveAs.saveAs(excelFile, excelFileName + excelFileExtension);
    }

    const down = async () => {
        excelDownload(list.data);
    }

    useEffect(() => {
        downOrderList(setList);
    }, [])

    return (
        <DownloadButton onClick={down}>주문정보 다운로드</DownloadButton>
    );
};

const DownloadButton = styled(Link)`
    line-height: 30px;
    background-color: #1a6dff;
    color: #fff;
    padding: 0px 10px;
    border-radius: 5px;
`

export default Download;