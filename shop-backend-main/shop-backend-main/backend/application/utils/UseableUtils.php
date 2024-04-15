<?php

    // IP 가져오는 함수
    function getRealClientIp() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP')) {
            $ipaddress = getenv('HTTP_CLIENT_IP');
        } else if(getenv('HTTP_X_FORWARDED_FOR')) {
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        } else if(getenv('HTTP_X_FORWARDED')) {
            $ipaddress = getenv('HTTP_X_FORWARDED');
        } else if(getenv('HTTP_FORWARDED_FOR')) {
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        } else if(getenv('HTTP_FORWARDED')) {
            $ipaddress = getenv('HTTP_FORWARDED');
        } else if(getenv('REMOTE_ADDR')) {
            $ipaddress = getenv('REMOTE_ADDR');
        } else {
            $ipaddress = '알수없음';
        }
        return $ipaddress;
    }

    //뭐에 씀?
    function check($input, $sel_db, $value) {
        foreach ($sel_db as $key => $val) {
            $test1 = $val->$value;
            $test2 = $input[$value];
            if($test1 !== $test2){
                return true;
            }else {
                return false;
            }            
        }
    }

    // 기존 이미지 파일 삭제
    function img_del($goods_code, $code_list, $type){
        switch($type){
            case "delete":
                $dir = IMG_PATH . "/goodsImg/thumbnail/". $goods_code;
                $result = rmdirAll($dir);
                foreach($code_list as $code){
                    $code = $code['img_code'];
                    $dir = IMG_PATH . "/product/". $code;
                    $result = rmdirAll($dir);
                }
                return $result;
            case "edit":
                foreach($code_list as $code){
                    $dir = IMG_PATH . "/product/". $code;
                    $result = rmdirAll($dir);
                }
                return $result;
        }
    }

    //상품 수정시 이미지 재검증
    function verifyImgCode($origin, $new){
        $originEx = explode('?code=', $origin);
        $newEx = explode('?code=', $new);
        $originArr = array();
        $newArr = array();
        foreach($originEx as $item){
            $exItem = substr($item,0,5);
            array_push($originArr, $exItem);
        }
        foreach($newEx as $item){
            $exItem = substr($item,0,5);
            array_push($newArr, $exItem);
        }
        $resultArr = array_diff($originArr, $newArr);
        return $resultArr;
    }

    //상품 썸네일 파일 존재 여부 체크
    function isFile($list){
        foreach($list as $item){
            $fullPath = $item->goods_img;
            if($fullPath !== ""){
                $pathArr = explode('/backend/',$fullPath);
                $path = $pathArr[1];
                if(!file_exists($path)){
                    $item->goods_img = "";
                }
            }
        }
    }

    
    //이니시스 관련
    function iniTransaction($dbObj, $param){
        try {
 
            //#############################
            // 인증결과 파라미터 수신
            //#############################

            if (strcmp("0000", $param["resultCode"]) == 0) {
 
                //############################################
                // 1.전문 필드 값 설정
                //############################################
 
                $mid        = $param["mid"];
                $timestamp  = getTimestamp();
                $charset    = "UTF-8";
                $format     = "JSON";
                $authToken  = $param["authToken"]; 
                $authUrl    = $param["authUrl"];
                $netCancel  = $param["netCancelUrl"];        
                $merchantData = $param["merchantData"];
                $orderCode = $param["orderCode"];
 
                //#####################
                // 2.signature 생성
                //#####################
                $signParam["authToken"] = $authToken;   // 필수
                $signParam["timestamp"] = $timestamp;   // 필수
                // signature 데이터 생성 (모듈에서 자동으로 signParam을 알파벳 순으로 정렬후 NVP 방식으로 나열해 hash)
                $signature = makeSignature($signParam);
 
 
                //#####################
                // 3.API 요청 전문 생성
                //#####################
                $authMap["mid"]        = $mid;       // 필수
                $authMap["authToken"]  = $authToken; // 필수
                $authMap["signature"]  = $signature; // 필수
                $authMap["timestamp"]  = $timestamp; // 필수
                $authMap["charset"]    = $charset;   // default=UTF-8
                $authMap["format"]     = $format;    // default=XML
 
                try {
                    $httpUtil = new HttpClient();
                    //#####################
                    // 4.API 통신 시작
                    //#####################
 
                    $authResultString = "";
                    if ($httpUtil->processHTTP($authUrl, $authMap)) {
                        $authResultString = $httpUtil->body;
 
                    } else {
                        echo "Http Connect Error\n";
                        echo $httpUtil->errormsg;
 
                        throw new Exception("Http Connect Error");
                    }
 
                    //############################################################
                    //5.API 통신결과 처리
                    //############################################################
                    
                    $resultMap = json_decode($authResultString, true);

                    // 통신결과 DB저장

                    $resultDb = $dbObj->ins_inisis($resultMap,$orderCode);
                    if($resultDb){
                        $dbObj->upd_order_complete($orderCode);
                        // $goods_code = $param['goods_code'];
                        // $test = $dbObj->sel_goods_stock($orderCode)-1;
                        // $dbObj->upd_stock_counting($test);
                        
                    }
                    
                    return $resultDb;
 
                } catch (Exception $e) {
                    //    $s = $e->getMessage() . ' (오류코드:' . $e->getCode() . ')';
                    //####################################
                    // 실패시 처리
                    //####################################
                    //---- db 저장 실패시 등 예외처리----//
                    $s = $e->getMessage() . ' (오류코드:' . $e->getCode() . ')';
                    echo $s;
 
                    //#####################
                    // 망취소 API
                    //#####################
 
                    $netcancelResultString = ""; // 망취소 요청 API url(고정, 임의 세팅 금지)
                    if ($httpUtil->processHTTP($netCancel, $authMap)) {
                        $netcancelResultString = $httpUtil->body;
                        
                        
                    } else {
                        echo "Http Connect Error\n";
                        echo $httpUtil->errormsg;
 
                        throw new Exception("Http Connect Error");
                    }
 
                    echo "<br/>## 망취소 API 결과 ##<br/>";
                    
                    /*##XML output##*/
                    //$netcancelResultString = str_replace("<", "&lt;", $$netcancelResultString);
                    //$netcancelResultString = str_replace(">", "&gt;", $$netcancelResultString);
 
                    // 취소 결과 확인
                    echo "<p>". $netcancelResultString . "</p>";
                }
            } else {
                $model = new OrderModel();
                $model->upd_order_fail($param);
            }
        } catch (Exception $e) {
            $s = $e->getMessage() . ' (오류코드:' . $e->getCode() . ')';
            echo $s;
        }
    }

    function getTimestamp()	{
        // timezone 을 설정하지 않으면 getTimestapme() 실행시 오류가 발생한다.
        // php.ini 에 timezone 설정이 되어 잇으면 아래 코드가 필요없다. 
        // php 5.3 이후로는 반드시 timezone 설정을 해야하기 때문에 아래 코드가 필요없을 수 있음. 나중에 확인 후 수정필요.
        // 이니시스 플로우에서 timestamp 값이 중요하게 사용되는 것으로 보이기 때문에 정확한 timezone 설정후 timestamp 값이 필요하지 않을까 함.
        date_default_timezone_set('Asia/Seoul');
        $date = new DateTime();
        
        $milliseconds = round(microtime(true) * 1000);	
        $tempValue1 = round($milliseconds/1000);		//max integer 자릿수가 9이므로 뒤 3자리를 뺀다
        $tempValue2 = round((float)microtime(false) * 1000);	//뒤 3자리를 저장
        switch (strlen($tempValue2)) {
            case '3':
                break;
            case '2':
                $tempValue2 = "0".$tempValue2;
                break;
            case '1':
                $tempValue2 = "00".$tempValue2;
                break;
            default:
                $tempValue2 = "000";
                break;
        }
        
        return "".$tempValue1.$tempValue2;
    }

    function makeSignature($signParam) {
        ksort($signParam);
        $string = "";
        foreach ($signParam as $key => $value) {
            $string .= "&$key=$value";
        }		
        $string = substr($string, 1); // remove leading "&"
        
        $sign = makeHash($string, "sha256");
                
        return $sign;
    }

    function makeHash($data, $alg) {
        // $s = hash_hmac('sha256', $data, 'secret', true);
        // return base64_encode($s);

        
        $ret = openssl_digest($data, $alg);
        
        
        return $ret;
    }

    function sendPost($url, $data){
        $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);

            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 요청 결과를 문자열로 받음
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // curl이 첫 응답 시간에 대한 timeout
            curl_setopt($ch, CURLOPT_TIMEOUT, 60); // curl 전체 실행 시간에 대한 timeout
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 원격 서버의 인증서가 유효한지 검사하지 않음
            $result = curl_exec($ch); // 요청 결과
            curl_close($ch);
        return $result;
    }
    function sendPost_new($url, $data, $key){
        $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);

            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 요청 결과를 문자열로 받음
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // curl이 첫 응답 시간에 대한 timeout
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Basic '. $key));
            curl_setopt($ch, CURLOPT_TIMEOUT, 60); // curl 전체 실행 시간에 대한 timeout
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 원격 서버의 인증서가 유효한지 검사하지 않음
            $result = curl_exec($ch); // 요청 결과
            curl_close($ch);
        return $result;
    }


    class HttpClient 
    {
        var $sock=0;
        var $ssl;
        var $host;
        var $port;
        var $path;
        var $status;
        var $headers="";
        var $body="";
        var $reqeust;
        var $errorcode;
        var $errormsg;

        function processHTTP($url, $param) {
            
            $data = "";
            foreach ($param as $key => $value) {
                $key2 = urlencode($key);
                $value2 = urlencode($value);
                $data .= "&$key2=$value2";
            }
            
            $data = substr($data, 1); // remove leading "&"
            $url_data = parse_url($url);
            
                    
            if ($url_data["scheme"]=="https")
            {
                $this->ssl = "ssl://";
                $this->port = 443;
            }
            
            $this->host = $url_data["host"];
            /*
            
                    if (is_null($url_data["port"])) {
                        $this->port = "80";
                    } else {
                        $this->port = $url_data["port"];
                    }
                    */
            
            $this->path = $url_data["path"];
            
            if (!$this->sock = @fsockopen($this->ssl.$this->host, $this->port, $errno, $errstr, CONNECT_TIMEOUT)) {
                
                switch($errno) {
                    case -3:
                        $this->errormsg = 'Socket creation failed (-3)';
                    case -4:
                        $this->errormsg = 'DNS lookup failure (-4)';
                    case -5:
                        $this->errormsg = 'Connection refused or timed out (-5)';
                    default:
                        $this->errormsg = 'Connection failed ('.$errno.')';
                        $this->errormsg .= ' '.$errstr;
                }
                return false;
            }
                    
            $this->headers="";
            $this->body="";

            /*Write*/
            $request  = "POST ".$this->path." HTTP/1.0\r\n";
            $request .= "Connection: close\r\n";
            $request .= "Host: ".$this->host."\r\n";
            $request .= "Content-type: application/x-www-form-urlencoded\r\n";
            $request .= "Content-length: ".strlen($data)."\r\n";
            $request .= "Accept: */*\r\n";
            $request .= "\r\n";
            $request .= $data."\r\n";
            $request .= "\r\n";
            fwrite($this->sock, $request);
            
            /*Read*/
            stream_set_blocking($this->sock, FALSE ); 
            $atStart = true;
            $IsHeader = true;
            $timeout = false;
            $start_time= time();
            while ( !feof($this->sock) && !$timeout ) {
                $line = fgets($this->sock, 4096);
                $diff=time()-$start_time;
                if( $diff >= READ_TIMEOUT){
                    $timeout = true;
                }
                if( $IsHeader ) {
                    if( $line == "" ) {
                        continue;
                    }
                    if( substr( $line, 0, 2 ) == "\r\n" ) {
                        $IsHeader = false;
                        continue;
                    }
                    $this->headers .= $line;
                    if ($atStart) {
                        $atStart = false;
                        if (!preg_match('/HTTP\/(\\d\\.\\d)\\s*(\\d+)\\s*(.*)/', $line, $m)) {
                            $this->errormsg = "Status code line invalid: ".htmlentities($line).$m[1].$m[2].$m[3];
                            fclose( $this->sock );
                            return false;
                        }
                        $http_version = $m[1];
                        $this->status = $m[2];
                        $status_string = $m[3];
                        continue;
                    }
                }
                else {
                    $this->body .= $line;
                }
            }
            
            
            fclose( $this->sock );

            if( $timeout )
            {
                $this->errorcode = READ_TIMEOUT_ERR;
                $this->errormsg = "Socket Timeout(".$diff."SEC)";
                return false;
            }
            return true;
        }

        function getErrorCode()
        {
            return $this->errorcode;
        }
        
        function getErrorMsg()
        {
            return $this->errormsg;
        }

        function getBody()
        {
            return $this->body;
        }
    }






    //더미
        /** DB연결 객체를 변수로, 그냥 $this->model 쓰면된다. $json은 getJson()으로 전달받은 data*/
    // function iniTransaction($dbObj, $param){
        
    //     try{
    //         $dbObj->pdo->beginTransaction();
    //         // 한 단위로 묶을 처리들 하나이상
    //         $confirm = $dbObj->sel_code_orders($param);
    //         //주문코드 일치여부 확인
    //         if (!$confirm) {
    //             throw new Exception('주문번호가 일치하지 않습니다.');
    //         }
    //         //authUrl 경로 확인
    //         if(!strpos($param['authUrl'],'inicis.com')){
    //             throw new Exception('잘못된 요청경로입니다.');
    //         }
    //         $authToken = $param['authToken'];
    //         $timestamp = getTimestamp();
    //         $signature = [
    //             'authToken'=> $authToken,
    //             'timestamp'=> $timestamp,
    //         ];

    //         $data = [
    //             'mid'=> $param['mid'],
    //             'authToken'=> $authToken,
    //             'timestamp'=> $timestamp,
    //             'signature'=> makeSignature($signature),
    //             'charset'=> $param['charset'],
    //             'format'=> 'JSON',
    //             'price'=> $confirm['goods_price'],
    //         ];
    //         $url = $param['authUrl'];

    //         $result = sendPost($url, $data);            


    //         $dbObj->pdo->commit();

    //         return $result;
    //     }
    //     catch(Exception $e){
    //         $dbObj->pdo->rollBack();
    //         return $e->getMessage();
    //     }
    // }