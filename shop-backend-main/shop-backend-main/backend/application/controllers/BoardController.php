<?php
namespace application\controllers;

class BoardController extends Controller {
    ////공용
    //리스트
    public function sel_board(){
        $json = getJson();
        $json["boardPage"] = ($json["boardPage"] - 1)*10;
        return $this->model->sel_board($json);
    }
    //상세페이지
    public function detail_board(){
        $json = getJson();
        $this->model->view_up($json);
        return $this->model->detail_board($json);
    }
    public function del_board(){
        $json = getJson();
        return $this->model->del_board($json);
    }

    //상품별 리뷰
    public function sel_goods_review(){
        $json = getJson();
        return $this->model->sel_goods_review($json);
    }
}