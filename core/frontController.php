<?php

    include "./core/View.php";

    if (isset($_GET["action"])) {
        $action = $_GET["action"];
    } else {
        if (isset($_POST["action"])) {
            $action = $_POST["action"];
        } else {
            $action = "converter";
        }
    }

    if (isset($_GET["id"])) {
        $id = $_GET["id"];
    } else {
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
        } else {
            $id = 0;
        }
    }

    if (!isset($db)) {
        require_once "./core/DataBase.php";
        require_once "./core/Model.php";
        $db = DataBase::getInstance(["localhost", "root", "", "web"]);
        $m = Model::getInstance($db);
        $time = time();
    }

    switch ($action) {
        case "converter":
            $v = new View("converter");
            $v->render();
            break;
        case "form":
            $v = new View("form");
            $v->render();
            break;
        case "coins":
            $m->sendCoins();
            break;
        case "cryptos":
            $m->sendCryptos();
            break;
        case "sendEmail":
            $m->endEmail();
            break;
    }


    if ((time() - $time) === 10800) {
        $m->updateCoins();
        $time = time();
    }

