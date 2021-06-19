<?php

include "core/models/Coin.php";
include "core/models/Crypto.php";

class Model
{

    private static $instance = null;
    private $db;

    private function __construct (DataBase $db) {
        $this->db = $db;
    }

    public static function getInstance(Database $db)
    {
        if (is_null(self::$instance))
            self::$instance = new self($db);
        return self::$instance;
    }


    public function sendCoins()
    {
        $coins =  $this->db->getCoins();
        $json = array();
        while ($row = $coins->fetch_assoc()) {
            $json[] = array(
                'name' => $row['name'],
                'symbol' => $row['symbol'],
                'value_usd' => $row['value_usd']
            );
        }
        echo json_encode($json);

    }

    public function sendCryptos()
    {
        $cryptos = $this->db->getCryptos();
        $json = array();
        while ($row = $cryptos->fetch_assoc()) {
            $json[] = array(
                'name' => $row['name'],
                'symbol' => $row['symbol'],
                'id' => $row['id'],
                'value_usd' => $row['value_usd']
            );
        }
        echo json_encode($json);
    }

    public function endEmail()
    {
        $msg = 'From:'.$_POST['email'].'/n Name:'.$_POST['name'].'/n Message: '.$_POST['description'];
        mail('sergio.erramuzpe@gmail.com', $_POST['title'], $msg);
        $_POST['action'] = 'form';
    }

    public function updateCoins()
    {
        $this->db->updateCoins();
    }

}