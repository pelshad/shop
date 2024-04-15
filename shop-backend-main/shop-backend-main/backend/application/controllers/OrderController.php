<?php
namespace application\controllers;
use Exception;

class OrderController extends Controller {
    ###############
    #### 공통부####
    ###############
    public function sel_orders(){
        $json = getJson();        
        return $this->model->sel_orders($json);
    }    

    ##################
    ##### 관리자 #####
    ##################
    //----검색----//
    //관리자 주문 불러오기
    public function sel_admin_orders(){
        $json = getJson();
        return $this->model->sel_admin_orders($json);
    }
    //관리자 주문 검색
    public function sel_code_orders(){
        $json = getJson();
        return $this->model->sel_code_orders($json);
    }

    //----대시보드----//
    //관리자 대시보드 불러오기
    public function sel_dash(){
        return $this->model->sel_dash();
    }
    //취소/환불된 주문만 불러오기
    public function get_refund_data(){
        return $this->model->get_refund_data();
    }

    //----주문/배송----//
    //주문관리 송장번호 수정
    public function update_invoice(){
        $json = getJson();
        return $this->model->update_invoice($json);
    }
    //엑셀 저장용 데이터 불러오기
    public function admin_orders(){
        return $this->model->admin_orders();
    }

    ##############
    #### 유저 ####
    ##############
    //--검색--//
    //유저용 주문 검색
    public function sel_user_code_orders(){
        $json = getJson();
        $data = $this->model->sel_user_orders_group($json);
        $result = $this->model->sel_user_code_orders($json);
        $result[0]->total_price = $data[0]->total_price;
        $result[0]->total_count = $data[0]->total_count;
        $result[0]->total_sale = $data[0]->total_sale;
        return $result;
    }
    //결제한 주문 불러오기
    public function sel_ini_orders(){
        $json = getJson();
        return $this->model->sel_ini_orders($json);
    }

    //--적립금--//
    

    //--장바구니--//
    //장바구니 불러오기
    public function findBasketByUserId(){
        $json = getJson();
        return $this->model->findBasketByUserId($json);
    }
    //장바구니 정보 입력
    public function saveBasket(){
        $json = getJson();
        return $this->model->saveBasket($json);
    }
    //장바구니 삭제
    public function deleteBasket(){
        $json = getJson();
        return $this->model->deleteBasket($json);
    }

    ###########
    ####주문####
    ###########
    //----주문----//
    //주문 정보 입력
    public function complete_orders() {               
        $json = getJson();        
        try {           
            $result = $this->model->complete_orders($json);
            if($result > 0){
                return [_RESULT => 'Success'];
            }
            
        } catch (Exception $e) {
            echo '데이터 입력실패';
        }
        return [_RESULT => 'Fail'];
    }

    //주문 정보 입력
    public function ins_orders() {               
        $json = getJson();
        if($json['basket_count'][0] !== null){
            $this->model->deleteBasket($json);
        }
        if($json["user_id"]){
            $param = $json["order_data"];
            try {
                foreach ($param as $key => $value) {
                    $json["goods_code"] = $value['goods_code'];
                    $json["goods_name"] = $value['goods_name'];
                    $json["goods_sale"] = $value['goods_sale'];
                    $json["order_pay"] = $value['order_pay'];
                    $json["order_count"] = $value['order_count'];
                    $this->model->ins_orders($json);
                }
                return [_RESULT => '데이터 입력성공'];
            } catch (Exception $e) {
                echo '데이터 입력실패';
            }
        }
        return [_RESULT => '로그인하세요.'];
    }
    //적립금 조작한지 체크
    public function checkUserPoint(){
        $json = getJson();
        $pointCheck = $this->model->checkUserPoint($json);
        if($pointCheck['result'] === "error"){
            $result = getPaymentError("E22");
            return $result;
        }
        $result = [
            "result" => "ok",
        ];
        return $result;
    }
    //구매확정
    public function recognize_order(){
        $json = getJson();
        return [_RESULT => $this->model->recognize_order($json)];
    }
    //주문 취소
    public function cancel_order(){
        $json = getJson();
        if($json['cancelType'] === "requestPg"){
            return [_RESULT => $this->model->cancel_order($json)];
        } else if($json['cancelType'] === "requestAdmin"){
            return [_RESULT => $this->model->req_cancel_order($json)];
        } else if($json['cancelType'] === "refusal"){
            return [_RESULT => $this->model->refues_cancel_order($json)];
        }
    }
    //관리자 취소 승인
    public function cancel_complete(){
        $json = getjson();
        return [_RESULT => $this->model->cancel_order($json)];
    }
    //고객 환불 요청
    public function refund_order(){
        $json = getJson();
        return [_RESULT => $this->model->refund_order($json)];
    }
    //관리자 환불 승인
    public function refund_complete(){
        $json = getJson();
        if($json['type'] === "refusal"){
            return [_RESULT => $this->model->refund_refuse($json)];
        }
        return [_RESULT => $this->model->refund_complete($json)];
    }

    ##############
    ####결제부####
    ##############
    //결제 테스트
    public function ini_transaction(){
        $orderCode = $_REQUEST['orderCode'];
        $result = iniTransaction($this->model,$_REQUEST);
        $result = $result;
        //로컬
        INILocalReturn($result, $orderCode);
        //서버
        // INIServerRetrun($result, $orderCode);
    }

    //토스 결제 테스트
    public function tos_ins(){
        $json = getJson();
        // 한 번 확인해봐야함 // ins_orders처럼 처음주문정보 담을려고했나
        // $this->model->ins_tos($json);
        $data = json_encode($json);
        $url = "https://api.tosspayments.com/v1/payments/confirm";
        $key = base64_encode(SECRET_KEY);
        try {
            $res = sendPost_new($url, $data, $key);
            
            $result = json_decode($res, true);
            if(count($result) > 2){
                $result["orderCode"] = $json["orderCode"];
                return [_RESULT => $this->model->ins_tos($result)];
            }
            
        } catch (Exception $e) {
            return $result;
        }
        return $result;
        // $result = $this->model->refund_complete($json);
    }
}