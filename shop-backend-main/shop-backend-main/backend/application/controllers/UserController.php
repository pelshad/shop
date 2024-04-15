<?php
namespace application\controllers;

class UserController extends Controller {
    ######################
    #### 가입 & 로그인 ####
    ######################
    //----회원가입----//
    //----로그인----//
    //패스워드 체크
    public function check_pw(){
        $json = getJson();
        $result = $this->model->check_pw($json);
        if($result){
            $data = $this->model->sel_user_data($json);
            return [_RESULT => "ok", "userData" => $data];
        }else{
            return [_RESULT => "fail"];
        }
    }

    public function ins_user() {
        $json = getEncryptedData();
        $checkId = $json['id'];
        $checkEmail = $json['email'];
        $result = [
            'id' => true,
            'email' => true,
        ];
        if($this->model->check_id($checkId) === 1){
            $result['id'] = false;
            return $result;
        }else if($this->model->check_email($checkEmail) === 1){
            $result['email'] = false;
            return $result;
        };
        return [_RESULT => $this->model->ins_user($json)];
    }

    //----로그인----//
    //로그인 체크
    public function sel_user(){
        $json = getJson();        
        return $this->model->sel_user($json);
    }
    //토큰 체크
    public function checkToken(){

        $headers = getAuthorizationHeader();
        if($headers !== "fail"){
            return $this->model->checkToken($headers);
        } else {
            $result = getJWTError("E00");
            return $result;
        }
    }

    //로그아웃(토큰 삭제)
    public function break_token(){
        $json = getJson();
        return $this->model->break_token($json);
    }

    ###################
    #### 마이페이지 ####
    ###################
    //----마이페이지----//
    public function myPage(){
        $json = getJson();
        $token = $this->model->checkToken($json);
        if($token['result'] === 'ok'){
            return $this->model->myPage($json);            
        };
    }

    //----주문내역----//

    //----찜한 상품----//
    //리스트 불러오기
    public function sel_pick_list(){
        $json = getJson();
        return $this->model->sel_pick_list($json);
    }

    //----기본 배송지 관리----//
    //배송지 리스트
    public function user_address(){
        $json = getjson();
        return $this->model->user_address($json);
    }
    //배송지 추가
    public function add_address(){
        $json = getJson();
        return $this->model->add_address($json);
    }
    //배송지 삭제
    public function del_address(){
        $json = getJson();
        return $this->model->del_address($json);
    }
    //기본 배송지로 설정
    public function set_default_address(){
        $json = getJson();
        return $this->model->set_default_address($json);
    }

    //----상품후기작성----//
    public function sel_user_review(){
        $json = getJson();
        return $this->model->sel_user_review($json);
    }

    //----개인정보수정----//
    //유저 정보 불러오기 ---> check_pw에 통합
    // public function sel_user_data(){
    //     $json = getJson();        
    //     return $this->model->sel_user_data($json);
    // }
    //유저 정보 수정
    public function upd_user(){
        $json = getJson();
        return [_RESULT => $this->model->upd_user($json)];
    }

    ##############
    #### 상품 ####
    ##############
    //----좋아요----//
    //좋아요 등록여부 확인
    public function sel_fav(){
        $json = getJson();
        return $this->model->sel_fav($json);
    }
    //좋아요 등록
    public function set_fav(){
        $json = getJson();
        return $this->model->set_fav($json);
    }
    //구매 리스트 불러오기
    public function buy_product_list(){
        $json = getJson();
        return $this->model->buy_product_list($json);
    }
    //적립금
    public function findPointByUserId(){
        $json = getJson();
        return $this->model->findPointByUserId($json);
    }


    //관리자 회원관리
    //회원 정보 불러오기
    public function sel_user_list(){
        $json = getJson();
        return $this->model->sel_user_list($json);
    }
    //회원 삭제
    public function del_user(){
        $json = getJson();
        return $this->model->del_user($json);
    }

    public function refresh_page(){
        return $this->model->refresh_page();
    }








########## 더미 ##########
    /* 회원등록
    public function ins_client(){
        $json = getJson();
        
        return $this->model->ins_client($json);            
    } 
    // 프로필 이미지 업로드
    public function profileInsImg(){
        $urlPaths = getUrlPaths();
        $userId = $urlPaths[2];
        $fileNm = create_img($userId, "profileImg");
        $param = [
            "userId" => $userId,
            "imgName" => $fileNm
        ];

        return $this->model->profileInsImg($param);
    }
    // 계정 삭제?
    public function del_user(){
        $json = getJson();
        return [_RESULT => $this->model->del_user($json)];
    }
    // 유저정보 변경
    
    // 친구 찾기
    public function find_friend(){
        $json = getJson();
        return $this->model->find_friend($json);
    }

    // 친구 요청
    public function req_friend(){
        $json = getJson();
        return [_RESULT => $this->model->req_friend($json)];
    }

    // 친구 요청 중 화면 출력
    public function reqing_friend(){
        $json = getJson();
        return $this->model->reqing_friend($json);
    }
    
    // 친추 취소
    public function deny_friend(){
        $json = getjson();
        return $this->model->deny_friend($json);
    }

    // 친구 삭제
    public function delete_friend(){
        $json = getjson();
        return $this->model->delete_friend($json);
    }

    // 친구 수락
    public function accept_friend(){
        $json = getjson();
        return $this->model->accept_friend($json);
    }*/
}