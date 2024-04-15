<?php
namespace application\controllers;



class DeliveryController extends Controller {
   
    //주문중 송장번호 없는거 선택
    public function sel_delivery_null(){
        $json = getJson();
        return $this->model->sel_delivery_null();
    }//

    //기본 택배사 선택
    public function sel_default_carrier(){
        $json = getJson();
        return $this->model->sel_default_carrier();
    }

    //기본 택배사 수정
    public function default_carrier(){
        $json = getJson();
        if($json){
            return $this->model->default_carrier($json);
        }else {
            return [_RESULT => 'fail'];
        }
    }

    //배송지 불러오기
    public function address_list(){
        $json = getJson();
        return $this->model->address_list($json);
    }

    //송장번호 업데이트
    public function upd_order_delivery(){
        $json = getJson();
        foreach ($json as $key => $value) {
            $result = $this->model->upd_order_delivery($value);
            if($result === 1){
                return [_RESULT => "Success"];
            }
        }
        return [_RESULT => "주문번호 : " . $value['orderCode'] . "의 송장번호 입력을 실패하였습니다."];
    }

    //송장번호 개별 업데이트
    public function upd_order_each_delivery(){
        $json = getJson();
        $result = $this->model->upd_order_each_delivery($json);
        if($result === 1){
            return [_RESULT => "Success"];
        }
        return [_RESULT => "주문번호 : " . $json['orderCode'] . "의 송장번호 입력을 실패하였습니다."];
    }

    //배송사 업데이트
    public function upd_order_carrier(){
        $json = getJson();
        $result = $this->model->upd_order_carrier($json);
        if($result === 1){
            return [_RESULT => "Success"];
        }
        return [_RESULT => "배송사 수정 실패"];
    }

}