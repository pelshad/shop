<?php
namespace application\controllers;



class ChatController extends Controller {
    // $data = 'aaaa
    // bbbb'; // 개행 문자를 포함한 데이터    

    //room에 chat message 전송
    public function send_message(){
        $json = getJson();

        //chat room 존재여부 확인
        $check_room = $this->model->check_room($json);

        if($json["CID"] && !$check_room){
            $this->model->add_room($json);
        }
        if($json['stat'] === "res"){
            $this->model->saveNotification($json);
        } else if($json['stat'] === "req"){
            $this->model->updateAdminChatRoom($json, 'N');
        }
        if($check_room){
            $this->model->send_message($json);
            return $this->model->sel_content($json);
        }
        return $this->model->send_message($json);
    }
    //room에 chat message 전송
    public function sel_content(){
        $json = getJson();
        return $this->model->sel_content($json);
    }
    //
    public function sel_admin_room(){
        $json = getJson();
        return $this->model->sel_admin_room();
    }
    //
    public function sel_admin_content(){
        $json = getJson();
        return $this->model->sel_admin_content($json);
    }
}