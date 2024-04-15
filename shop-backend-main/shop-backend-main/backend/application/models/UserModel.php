<?php
namespace application\models;
use PDO;
use PDOException;

class UserModel extends Model {
    ######################
    #### 가입 & 로그인 ####
    ######################
    //----회원가입----//
    public function ins_user($param) {
        $pw = $param["pw"];
        $hashPw = password_hash($pw, PASSWORD_DEFAULT);
        $sql = "INSERT INTO user
                (
                    user_id, user_pw, user_nm, user_addr, user_tel, user_email
                )
                VALUES
                (
                    :user_id, '$hashPw', :user_nm, :user_addr, :user_tel, :user_email
                )
                ON DUPLICATE KEY
                    UPDATE user_insdate = CURRENT_TIMESTAMP
                ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["id"]);
        $stmt->bindValue(":user_email", $param["email"]);       
        $stmt->bindValue(":user_nm", $param["name"]);       
        $stmt->bindValue(":user_addr", $param["address"]);       
        $stmt->bindValue(":user_tel", $param["tell"]);       
        $stmt->execute();
        return intval($this->pdo->lastInsertId());
    }
    //패스워드 체크
    public function check_pw($param){
        $sql = "SELECT * FROM user
                WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['user_id']);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($param["user_pw"], $data['user_pw'])){
            return true;
        } else {
            return false;
        }
    }
    //계정 중복 체크
    public function check_id($checkId){
        $sql = "SELECT * FROM user
                WHERE user_id = BINARY :checkId";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":checkId", $checkId);
        $stmt->execute();
        $row = $stmt->rowCount();
        return $row;
    }
    //이메일 중복 체크
    public function check_email($checkEmail){
        $sql = "SELECT * FROM user
                WHERE user_email = BINARY :checkEmail";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":checkEmail", $checkEmail);
        $stmt->execute();
        $row = $stmt->rowCount();
        return $row;
    }


    //----로그인----//
    //로그인 체크
    public function sel_user($param){        
        $sql = "SELECT * FROM user
                WHERE user_id = BINARY :user_id AND active = 0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['id']);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if($data === false){
            $result = [
                "msg" => "존재하지 않는 아이디입니다",
                "result" => "fail",
            ];
        } else {
            if(password_verify($param["pw"], $data['user_pw'])){
                $result = $this->pass_user($param['id']);
            } else {
                $result = [
                    "msg" => "비밀번호가 다릅니다",
                    "result" => "fail"
                ];
            }
        }
        return $result;
    }
    //로그인 통과시 토큰 발행
    private function pass_user($userId){
        $token = createJWT($userId, "A");
        $Atoken = $token['AJWT'];
        $Rtoken = $token['RJWT'];
        $sql = "INSERT INTO token
                (user_id , Atoken, Rtoken)
                VALUE
                ('$userId', '$Atoken', '$Rtoken')
                ON DUPLICATE KEY
                UPDATE user_id='$userId', Atoken='$Atoken'";
        $stmt2 = $this->pdo->prepare($sql);
        $stmt2->execute();
        $result = [
            'loginCheck' => "success",
            'token' => $Atoken
        ];
        return $result;
    }

    #####################
    //Access token 체크//
    #####################
    //A토큰 : ACCESS TOKEN(10분 뒤 만료)(테스트 중 10초)
    //R토큰 : REFRASH TOKEN(2주 뒤 만료)(테스트 중 10분)
    //JWT 토큰 관련 함수는 SecurityUtils에 있음
    public function checkToken($header){
        //1. A토큰 유효성 검증
        $result = verifyAToken($header);

        //관리자 프리패스(임시)
        if($result['pass']){    
            return $result;
        }

        //관리자 아니면 검증
        $Atoken = $result['header'];
        //->2P. 중복 로그인 검증
        if($result['result'] === "ok"){
            $result = $this->duplicateLogin($Atoken, $result['id']);
        } 
        //->3P and 4P. R토큰 검증
            //3-1. A토큰이 만료되지 않았으면
            //R토큰 검증 후 R토큰 DB에 재저장
        if($result['result'] === "ok"){
            $result = $this->verifyRToken($Atoken, "pass");
        }
            //3-2. A토큰이 만료되었으면
            //R토큰 검증후 DB를 터뜨릴지 A토큰 다시 받을지 정함
        if($result['error'] === "E01"){
            $result = $this->verifyRToken($Atoken,"fail");
        }
        if($result === null||$result === ""||$result === []){
            $result = getJWTError("E07");
        }
        
        return $result;
    }

    //2P. 중복 로그인 검증
    private function duplicateLogin($Atoken, $id){
        $sql = "SELECT user_id
                FROM token
                WHERE Atoken = '$Atoken'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $count = $stmt->fetch();
        if($count === false){
            $result = getJWTError("E02");
        } else {
            $result = [
                "result" => "ok",
                "id" => $id
            ];
        }
        return $result;
    }

    //3P.R토큰 검증
    private function verifyRToken($Atoken, $state){
        $sql = "SELECT Rtoken
                FROM token
                WHERE Atoken = '$Atoken'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $Rtoken = $stmt->fetch();
        if($Rtoken[0] === null || $Rtoken[0] === "" || $Rtoken[0] === []){
            $result = getJWTError("E06");
        } else {
            $sqlResult = sendRtoken($Rtoken[0], $state);
            $result = $this->handleToken($sqlResult);
        }
        return $result;
    }

    //4P. 각 상태별 토큰 조작
    private function handleToken($result){
        $Rtoken = $result['Rtoken'];
        $id = $result['id'];
        switch($result['msg']){
            //두 토큰 전부 만료되지 않음
            case "pass":
                $result = [
                    "result" => "ok",
                    "id" => $result['id'],
                    "msg" => "토큰 둘다 pass"
                ];
                break;
            //A토큰은 만료X, R토큰 만료 O
            case "renewRtoken":
                $result = [
                    "result" => "ok",
                    "id" => $result['id'],
                    "msg" => "Rtoken 재발급되었습니다."
                ];
                $sql = "UPDATE token SET Rtoken = '$Rtoken' WHERE user_id = '$id'";
                $stmt=$this->pdo->prepare($sql);
                $stmt->execute();
                break;
            //A토큰 만료O, R토큰 만료 X
            case "renewAtoken":
                $Atoken = $result['Atoken'];
                $result = [
                    "result" => "ok",
                    "id" => $result['id'],
                    "Atoken" => $Atoken,
                    "res" => "renew",
                    "msg" => "Atoken 재발급되었습니다."
                ];
                $Atoken = $result['Atoken'];
                $sql = "UPDATE token SET Atoken = '$Atoken' WHERE Rtoken='$Rtoken'";
                $stmt=$this->pdo->prepare($sql);
                $stmt->execute();
                break;
            //두 토큰 전부 만료
            case "destroy":
                $result = getJWTError("E03");
                $sql = "DELETE FROM token WHERE Rtoken = '$Rtoken'";
                $stmt=$this->pdo->prepare($sql);
                $stmt->execute();
                break;
        }
        return $result;
    }
    
    // 로그아웃(토큰삭제)
    public function break_token($param){
        $sql = "DELETE FROM token WHERE user_id = BINARY :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["userId"]);
        $stmt->execute();
        return intval($this->pdo->lastInsertId());
    }
    
    ###################
    #### 마이페이지 ####
    ###################
    //----마이페이지----//
    public function myPage($param){
        $sql = "SELECT * FROM user
                WHERE user_id = BINARY :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['userId']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //----주문내역----//

    //----찜한 상품----//
    //리스트 불러오기
    public function sel_pick_list($param){
        $sql = "SELECT * FROM goods
                WHERE goods_code IN (
                SELECT goods_code FROM fav 
                WHERE user_id = :user_id
                AND is_fav = 1)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['user_id']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
        // $resultArr = array();

        // for($i = 0; $i < count($favResult); $i++){
        //     array_push($resultArr, $favResult[$i]['goods_code']);
        // }
    }

    //----기본 배송지 관리----//
    //배송지 리스트
    public function user_address($param){
        $sql = "SELECT * FROM user_address
                WHERE user_id = BINARY :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['userId']);
        $stmt->execute();       
        
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //배송지 추가
    public function add_address($param){
        //기본 배송지 등록 여부 체크
        $sql = "SELECT * FROM user_address
                WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->execute();
        $row = $stmt->rowCount();
        if($row === 0){
            //기본 배송지 없으면 자동으로 기본 배송지로
            $sql = "INSERT INTO user_address
                    (user_id, ship_name, ship_address, ship_detail_address, ship_phone, ship_receiver, default_address)
                    values
                    (:user_id, :ship_name, :ship_address, :ship_detail_address, :ship_phone, :ship_receiver, 1)";
        }else{
            //기본 배송지 있으면 그냥 등록
            $sql = "INSERT INTO user_address
                    (user_id, ship_name, ship_address, ship_detail_address, ship_phone, ship_receiver)
                    values
                    (:user_id, :ship_name, :ship_address, :ship_detail_address, :ship_phone, :ship_receiver)";
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->bindValue(":ship_name", $param["ship_name"]);
        $stmt->bindValue(":ship_address", $param["ship_address"]);
        $stmt->bindValue(":ship_detail_address", $param["ship_detail_address"]);
        $stmt->bindValue(":ship_phone", $param["ship_phone"]);
        $stmt->bindValue(":ship_receiver", $param["ship_receiver"]);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }
    //배송지 삭제
    public function del_address($param){
        $sql = "DELETE FROM user_address WHERE i_addr = :i_addr";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue("i_addr", $param["i_addr"]);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }
    //기본 배송지로 등록
    public function set_default_address($param){
        $sql = "UPDATE user_address SET default_address = 0 WHERE user_id = :user_id";
        $sql2 = "UPDATE user_address SET default_address = 1 WHERE i_addr = :i_addr";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->execute();
        $stmt = $this->pdo->prepare($sql2);
        $stmt->bindValue(":i_addr", $param["i_addr"]);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }

    //----상품후기 불러오기----//
    public function sel_user_review($param){
        $param = $param;
        $sql = "SELECT * FROM orders AS a
                INNER JOIN goods AS b
                ON a.goods_code = b.goods_code
                WHERE user_id = :user_id AND status='구매확정'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    //----개인정보수정----//
    //유저 정보 불러오기
    public function sel_user_data($param){  
        $sql = "SELECT user_id, user_nm, user_addr, user_tel,user_email FROM user
                WHERE user_id = BINARY :user_id AND active = 0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $result = $stmt->execute();
        
        return  $stmt->fetchAll(PDO::FETCH_OBJ);;
    }
    // 유저 정보 수정
    public function upd_user($param) {
        if(isset($param["user_pw"])) {
            $sql = "SELECT * FROM user
                    WHERE user_id = BINARY :user_id AND active = 0";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->execute();
            $fail = ["fail"];
            $data = $stmt->fetch(PDO::FETCH_ASSOC);        
            $pwData = $data['user_pw'];
            $pw = $param["current_pw"];
            if(!password_verify($pw, $pwData)){
                return $fail;
            } else {
            $hashPw = password_hash($param['user_pw'], PASSWORD_DEFAULT);        
            $sql = "UPDATE user SET
                    user_pw = '$hashPw', user_nm = :user_nm, user_addr = :user_addr, user_tel = :user_tel, user_email = :user_email
                    WHERE user_id = :user_id
                    ";
            $stmt2 = $this->pdo->prepare($sql);
            $stmt2->bindValue(":user_id", $param["user_id"]);
            $stmt2->bindValue(":user_email", $param["user_email"]);       
            $stmt2->bindValue(":user_nm", $param["user_nm"]);        
            $stmt2->bindValue(":user_addr", $param["user_addr"]);       
            $stmt2->bindValue(":user_tel", $param["user_tell"]);       
            $row = $stmt2->execute();
            return $row;
        }
        } else {
            $sql = "UPDATE user SET
                    user_nm = :user_nm, user_addr = :user_addr, user_tel = :user_tel, user_email = :user_email
                    WHERE user_id = :user_id
                    ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->bindValue(":user_email", $param["user_email"]);       
            $stmt->bindValue(":user_nm", $param["user_nm"]);        
            $stmt->bindValue(":user_addr", $param["user_addr"]);       
            $stmt->bindValue(":user_tel", $param["user_tell"]);       
            $row = $stmt->execute();
            return $row;
        }
    }

    ##############
    #### 상품 ####
    ##############
    //----좋아요----//
    //좋아요 등록여부 확인
    public function sel_fav($param){
        $param = $param;
        $sql = "SELECT * FROM fav 
                WHERE user_id = :user_id 
                AND goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue("user_id", $param["user_id"]);
        $stmt->bindValue("goods_code", $param["goods_code"]);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
    //좋아요 등록
    public function set_fav($param){
        $param = $param;
        $sql = "INSERT INTO fav
                (goods_code, user_id, is_fav)
                VALUES
                (:goods_code, :user_id, :is_fav)
                ON DUPLICATE KEY UPDATE is_fav = :set_fav";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->bindValue(":goods_code", $param["goods_code"]);
        $stmt->bindValue(":is_fav", $param["is_fav"]);
        $stmt->bindValue(":set_fav", $param["is_fav"]);
        $stmt->execute();
        return "1";
    }
    //구매 리스트 불러오기
    public function buy_product_list($param){
        $sql = "SELECT * FROM orders AS OC
        INNER JOIN goods AS GC
        ON OC.goods_code = GC.goods_code
        WHERE user_id = :user_id AND order_complete = 'Y'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //적립금 불러오기
    public function findPointByUserId($param){
        $sql = "SELECT user_point FROM user WHERE user_id = :user_id";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e){
            return getPDOException($e);
        }
        
        
    }

    //관리자 회원관리
    //회원 정보 불러오기
    public function sel_user_list($param){
        isset($param["search"] )
            ? $search = $param["search"]
            : $search = "";
        $count = $this->getUserPage($param, $search);
        $list = $this->getUserList($param, $search);
        $param = [
            "count" => $count,
            "list" => $list
        ];
        return $param;
    }
        //회원 정보 페이징
        private function getUserPage($param, $search){
            $sql = "SELECT ceil(COUNT(uid)/10) as page_count
                    FROM user";
                isset($param["search"])
                    ? $sql .= " WHERE user_email LIKE '%$search%'"
                    : "";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            return $count;
        }
        //회원 리스트 불러오기
        private function getUserList($param, $search){
            $n = ($param["boardPage"] - 1)*10;
            $sql = "SELECT uid, user_id, user_nm, user_addr, user_tel, user_email, user_insdate, grade
                    FROM user";
                    isset($param["search"])
                        ? $sql .= " WHERE user_email LIKE '%$search%'"
                        : "";
            $sql .= " ORDER BY uid DESC
                        LIMIT $n, 10";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $list;
        }
    //회원 삭제
    public function del_user($param){
        $sql = "DELETE FROM user WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["user_id"]);
        $stmt->execute();
        return "success";
    }








    ////더미(회원수첩거)
    /*
    public function upd_user($param){
        $sql = "UPDATE user SET id = BINARY :cid
                WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":cid", $param["cid"]);
        $stmt->bindValue(":id", $param["id"]);           
        $stmt->execute();
        return $stmt->rowcount();
    }

    public function del_user($param){
        $sql = "UPDATE user set active = binary 1
                WHERE user_id = BINARY :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param["id"]);        
        $stmt->execute();
        return $stmt->rowcount();
    } 

    // 친구 찾기 //본인 제외
    public function find_friend($param){
        $search = $param["searchUser"];
        $id = $param['userId'];
        $sql = "SELECT id FROM (SELECT id FROM user WHERE id NOT LIKE BINARY '$id') AS t1 WHERE id LIKE BINARY '%$search%'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    
    // 친구 요청
    public function req_friend($param){
        $sql = "REPLACE INTO friends
            (
                reqFri, resFri, onFriend
            )
            VALUES
            (
                :req, :res, 0
            )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":req", $param["requestUser"]);
        $stmt->bindValue(":res", $param["responseUser"]);
        $stmt->execute();
        return $stmt->rowcount();
    }

    //친구 요청 중 화면 출력
    public function reqing_friend($param){
        $user = $param["user"];
        $sql = "SELECT * FROM friends WHERE reqFri = '$user' OR resFri = '$user'";
        $stmt = $this->pdo->prepare($sql);
        // $stmt->bindValue("user", $param["user"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    
    //친구 요청 취소
    public function deny_friend($param){
        $sql = "DELETE FROM friends 
                WHERE reqFri = :reqUser 
                AND resFri = :resUser";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindvalue("reqUser", $param["requestUser"]);
        $stmt->bindvalue("resUser", $param["responseUser"]);
        $stmt->execute();
        return intval($this->pdo->lastInsertId());
    }

    //친구 삭제
    public function delete_friend($param){
        $reqUser = $param["requestUser"];
        $resUser = $param["responseUser"];
        $sql = "DELETE FROM friends 
                WHERE reqFri = '$reqUser' AND resFri = '$resUser'
                OR reqFri = '$resUser' AND resFri = '$reqUser'";
        $stmt = $this->pdo->prepare($sql);
        // $stmt->bindvalue("reqUser", $param["requestUser"]);
        // $stmt->bindvalue("resUser", $param["responseUser"]);
        $stmt->execute();
        return intval($this->pdo->lastInsertId());
    }

    //친구 수락 or 거절
    public function accept_friend($param){
        if($param["isFriend"] === true ){
            $sql = "UPDATE friends
                SET onfriend = '1'
                WHERE resFri = :user AND reqFri = :reqUser";
        } else {
            $sql = "DELETE FROM friends 
                    WHERE reqFri = :reqUser 
                    AND resFri = :user";
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindvalue("user", $param["requestUser"]);
        $stmt->bindvalue("reqUser", $param["responseUser"]);
        $stmt->execute();
        return intval($this->pdo->lastInsertId());
    }*/
}