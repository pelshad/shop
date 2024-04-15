<?php

namespace application\controllers;

class DataController extends Controller {
    public function sell_data_list(){
        $json = getJson();
        return $this->model->sell_data_list($json);
    }
    public function cumulative_sales(){
        $json = getJson();
        return $this->model->cumulative_sales($json);
    }
    public function user_count(){
        $ip = ['access_ip' => getRealClientIp()];
        $result = $this->model->user_count($ip);
        if($result !== 0){
            $this->model->upd_user_count();
        }
        return [_RESULT => 'success'];
    }
    public function sel_user_count(){        
        return $this->model->sel_user_count();
    }
} 