<?php

function getJWTError(String $ErrorCode){
    $result = [
        "result" => "fail",
        "error" => $ErrorCode
    ];
    switch($ErrorCode){
        case "E00":
            $result["msg"] = "올바르지 않은 Header값 입니다.";
            break;
        case "E02":
            $result["msg"] = "다른 기기에서 로그인이 감지되었습니다.";
            break;
        case "E03":
            $result["msg"] = "모든 토큰이 만료되었습니다.";
            break;
        case "E04": //할당 안됨
            $result["msg"] = "";
            break;
        case "E05":
            $result["msg"] = "올바르지 않은 토큰 값입니다.";
            break;
        case "E06":
            $result["msg"] = "토큰 충돌 발생";
            break;
        case "E07":
            $result["msg"] = "알 수 없는 에러가 발생했습니다.";
            break;
    }
    return $result;
}

function getPaymentError(String $ErrorCode){
    $result = [
        "result" => "fail",
        "error" => $ErrorCode
    ];
    switch($ErrorCode){
        case "E21":
            $result["msg"] = "결제취소를 실패했습니다  :: ";
            break;
        case "E22":
            $result["msg"] = "보유하고 있는 적립금을 초과하는 적립금을 사용요청";
            break;
        case "E23":
            $result["msg"] = "클라이언트와 서버의 상품 금액이 다름";
            break;
    }
    return $result;
}

function getPDOException(PDOException $e){
    $result = [
        "result" => "fail",
        "msg" => $e->getMessage(), 
        "error" => "E11"
    ];
    return $result;
}

function getDBError(String $ErrorCode){
    $result = [
        "result" => "fail",
        "error" => $ErrorCode
    ];
    switch($ErrorCode){
        case "E12":
            $result["msg"] = "Failed to apply state to DB";
            break;
        case "E14":
            $result["msg"] = "상품명 중복";
            break;
    }
    
    return $result;
}

function getParameterError($ErrorCode){
    $result = [
        "result" => "fail",
        "error" => $ErrorCode
    ];
    switch($ErrorCode){
        case "E13":
            $result["msg"] = "invalid parameter value";
            break;
    }
    return $result;
}