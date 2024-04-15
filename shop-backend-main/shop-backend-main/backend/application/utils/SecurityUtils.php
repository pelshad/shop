<?php
    require_once __DIR__ . '../../../vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    //생성하려는 문자 길이를 넣으면 세 가지 타입의 문자가 길이만큼 랜덤생성됨
    function getToken($length) {        
        $characters  = "0123456789";
        $characters .= "abcdefghijklmnopqrstuvwxyz";
        $characters .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $characters .= "_";
        $string_generated = "";
        $nmr_loops = $length;
            while ($nmr_loops--){
            $string_generated .= $characters[mt_rand(0, strlen($characters) - 1)];
            }               
        return $string_generated;
    }
    ################
    //JWT 관련 함수//
    ################
    /*에러코드*/
    /*
    E00 : Header(Authorization)값이 잘못되었음
    E01 : 액세스 토큰 만료
        (*프론트로 리턴되지 않고 백에서 검증 
        RToken이 만료되지 않았으면 => 새로 AToken을 만들어서 리턴해주면서 통과
        RToken이 만료되었으면 => E03 에러)
    E02 : 다른 기기에서 로그인 감지
    E03 : 모든 토큰 만료
    E04 : ?????
    E05 : 올바르지 않은 토큰값(server cookie 값이랑 header cookie값이 다름)
    E06 : 토큰 충돌(A토큰이 만료된 상태에서 중복 로그인해서 생김)
    E07 : 알 수 없는 에러(검증 코드가 정상적으로 안돌고 있음)
    */
    /**
     * JWT토큰 생성
     * @param String $userId 유저 아이디
     * @param String $type "A" or "R", "A"인 경우 서버 cookie단에 AJWT가 들어감
     * @return
     */
    function createJWT($userId, $type){
        /* a = access, r = refresh */
        /* payload값 */
        
        $aPayload = [
            "sub" => "lifehim",
            // "exp" => date("YmdHis",strtotime('+10 minute')),
            "exp" => date("YmdHis",strtotime('+10 second')),
            "aud" => $userId
        ];
        $rPayload = [
            "sub" => "lifehim",
            // "exp" => date("YmdHis",strtotime('+2 week')),
            "exp" => date("YmdHis",strtotime('+10 minute')),
            // "exp" => date("YmdHis",strtotime('+10 second')),
            "aud" => $userId
        ];

        $AJWT = JWT::encode($aPayload, ACCESS_KEY, 'HS256');
        $RJWT = JWT::encode($rPayload, REFRESH_KEY, 'HS256');

        if($type === "A"){
            //Access token은 서버 cookie에 저장
            setcookie( $userId, $AJWT, httponly:true );
        }

        $JWT = [
            'AJWT' => $AJWT,
            'RJWT' => $RJWT
        ];
        return $JWT;
    }

    // Authorization 헤더 값 가져온 뒤 JWT 토큰 추출
    function getAuthorizationHeader() {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        }
        else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        }
        else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        preg_match('/Bearer\s(\S+)/', $headers, $matches);
        $jwt_token = $matches[1];

        if ($jwt_token !== "null" || $jwt_token !== null || $jwt_token !== "") {
            return $jwt_token;
        } else {
            return "fail";
        }
    }

    /**
     * A토큰 검증
     * @param String $token A토큰값
     * @return
     */
    function verifyAToken($token){
        //토큰 유효성 검증
        $decoded = JWT::decode($token, new Key(ACCESS_KEY, 'HS256'));
        $ID = $decoded->aud;
        if($ID === "admin" || $ID === "pkd" || $ID === "test"){
            $result = [
                "id" => $ID,
                "result" => "ok",
                "pass" => "admin",
                "msg" => "관리자는 프리패스지"
            ];
        } else {
            $getCookie = $_COOKIE[$ID];
            if($getCookie === $token){
                $result = [
                    "id" => $ID,
                    "result" => "ok",
                    "header" => $token
                ];
            } else if ($getCookie !== $token){
                $result = getJWTError("E05");
            }
            //A토큰 만료 시간 검증(* 프론트로 리턴되지 않음)
            if(date("YmdHis") > $decoded->exp){ 
                $result = [
                    "result" => "fail",
                    "msg" => "엑세스 토큰이 만료되었습니다.",
                    "error" => "E01",
                    "header" => $token
                ];
            } 
        }
        return $result;
    }

    /**
     * R토큰 검증
     * @param String $Rtoken
     * @param String $state Atoken 통과여부("pass" or "fail")
     * @return
     */
    function sendRtoken($Rtoken, $state){
        //필요한 값 Rtoken, user_id
        //DB에서 꺼내온 Rtoken 검증
        $decoded = JWT::decode($Rtoken, new Key(REFRESH_KEY, 'HS256'));
        
        //case: Atoken이 pass인 경우
        //case: Atoken이 fail인 경우
        switch($state){
            case "pass":
                //Rtoken 만료시
                //return renew
                if(date("YmdHis") >= $decoded->exp){
                    $newRToken = createJWT($decoded->aud,"R");
                    $result = [
                        "msg" => "renewRtoken",
                        "Rtoken" => $newRToken['RJWT'],
                        "id" => $decoded->aud,
                    ];
                } else {
                    $result = [
                        "id" => $decoded->aud,
                        "result" => "ok",
                        "msg" => "pass"
                    ];
                }
                break;
            case "fail":
                //Rtoken 만료시
                //이 함수에서는 destroy return
                //->4P. destroy를 받으면 token 정보 삭제
                //result "fail" error "E03 "리프레시 토큰이 만료되었습니다." 리턴
                if(date("YmdHis") > $decoded->exp){
                    $result = [
                        "msg" => "destroy",
                        "Rtoken" => $Rtoken,
                        "id" => $decoded->aud
                    ];
                }
                //Rtoken 만료되지 않았을 경우
                //새로운 Atoken 생성하여 Atoken값과 renew를 return
                //->4P. renew를 받으면 Atoken값 update
                //Atoken값과 ID, result "OK" 리턴
                else{
                    $newAToken = createJWT($decoded->aud,"A");
                    $result = [
                        "msg" => "renewAtoken",
                        "Rtoken" => $Rtoken,
                        "Atoken" => $newAToken['AJWT'],
                        "id" => $decoded->aud,
                    ];
                }
                break;
        }
        return $result;
    }

    
    //리펙토링용 함수
    /**
     * 만료체크
     * @param String $token JWT토큰값
     * @param String $type 토큰 종류("A" or "R")
     * @return String "fail" 만료됨, "pass" 만료되지 않음
     */
    
    function tokenExpiration($token, $type){
        switch($type){
            case "A":
                $decoded = JWT::decode($token, new Key(ACCESS_KEY, 'HS256'));
                break;
            case "R":
                $decoded = JWT::decode($token, new Key(REFRESH_KEY, 'HS256'));
                break;
        }
        if(date("YmdHis") > $decoded->exp){
            return "fail";
        } else{
            return "pass";
        }
    }