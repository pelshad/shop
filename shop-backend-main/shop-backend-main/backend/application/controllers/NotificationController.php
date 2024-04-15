<?php
namespace application\controllers;
use Exception;

class NotificationController extends Controller {
    public function NotifyToUser(){
        $json = getJson();
        return $this->model->NotifyToUser($json);
    }
    public function checkNotification(){
        $json = getJson();
        return $this->model->checkNotification($json);
    }

    
    public function NotifyToAdmin(){
        $json = getJson();
        return $this->model->NotifyToAdmin($json);
    }
}