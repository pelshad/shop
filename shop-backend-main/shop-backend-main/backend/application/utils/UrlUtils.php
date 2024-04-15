<?php
    
    function getJson() {
        $reqBody = addslashes(file_get_contents('php://input'));
        $data = json_decode(stripcslashes($reqBody), true);
        return $data;
    }
    function getEncryptedData(){
        $encryptedData = getJson()['encryptedData'];
        $decryptedData = decrypt($encryptedData, _SECRET_KEY);
        $DataToJson = json_decode($decryptedData, true);
        return $DataToJson;
    }

    function decrypt($ciphertext, $password) {
        $ciphertext = base64_decode($ciphertext);
        if (substr($ciphertext, 0, 8) != "Salted__") {
            return false;
        }
        $salt = substr($ciphertext, 8, 8);
        $keyAndIV = evpKDF($password, $salt);
        $decryptPassword = openssl_decrypt(
            substr($ciphertext, 16),
            "aes-256-cbc",
            $keyAndIV["key"],
            OPENSSL_RAW_DATA, // base64 was already decoded
            $keyAndIV["iv"]);
        return $decryptPassword;
    }
    function evpKDF($password, $salt, $keySize = 8, $ivSize = 4, $iterations = 1, $hashAlgorithm = "md5") {
        $targetKeySize = $keySize + $ivSize;
        $derivedBytes = "";
        $numberOfDerivedWords = 0;
        $block = NULL;
        $hasher = hash_init($hashAlgorithm);
        while ($numberOfDerivedWords < $targetKeySize) {
            if ($block != NULL) {
                hash_update($hasher, $block);
            }
            hash_update($hasher, $password);
            hash_update($hasher, $salt);
            $block = hash_final($hasher, TRUE);
            $hasher = hash_init($hashAlgorithm);
            // Iterations
            for ($i = 1; $i < $iterations; $i++) {
                hash_update($hasher, $block);
                $block = hash_final($hasher, TRUE);
                $hasher = hash_init($hashAlgorithm);
            }
            $derivedBytes .= substr($block, 0, min(strlen($block), ($targetKeySize - $numberOfDerivedWords) * 4));
            $numberOfDerivedWords += strlen($block)/4;
        }
        return array(
            "key" => substr($derivedBytes, 0, $keySize * 4),
            "iv"  => substr($derivedBytes, $keySize * 4, $ivSize * 4)
        );
    }

    function getParam($key) {
        return isset($_GET[$key]) ? $_GET[$key] : "";
    }

    function getUrl() {
        return isset($_GET['url']) ? rtrim($_GET['url'], '/') : "";
    }

    function getUrlPaths() {
        $getUrl = getUrl();        
        return $getUrl !== "" ? explode('/', $getUrl) : "";
    }

    function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    function isGetOne() {
        $urlPaths = getUrlPaths();
        if(isset($urlPaths[2])) { //one
            return $urlPaths[2];
        }
        return false;
    }

    function INILocalReturn($result, $orderCode){
        if($result == '1'){
            echo("<script>location.replace('http://localhost:3000/order/complete?orderCode=$orderCode');</script>");
        } else{
            echo("<script>location.replace('http://localhost:3000');</script>");
        }
    }
    function INIServerRetrun($result, $orderCode){
        if($result == '1'){
            echo("<script>location.replace('http://lifehim.com/order/complete?orderCode=$orderCode');</script>");
        } else{
            echo("<script>location.replace('http://lifehim.com/');</script>");    
        }
    }
    