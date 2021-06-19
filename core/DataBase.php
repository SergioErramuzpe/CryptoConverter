<?php
class DataBase
{
    private static $instance = NULL;
    private $conexion;

    private function __construct($params) {
        $this->conexion = mysqli_connect($params[0],$params[1],$params[2],$params[3]);
        if (!$this->conexion)
            echo "Error de conexion";
    }

    public static function getInstance($params) {
        if (is_null(self::$instance))
            self::$instance = new self($params);
        return self::$instance;
    }

    private function makeQuery ($query) {
        return $this->conexion->query($query);
    }

    public function updateCoins()
    {
        $curl = curl_init();
        $query = "select id from crypto";
        $cryptos = $this->makeQuery($query);
        while ($crypto = $cryptos->fetch_assoc()) {
            $id = $crypto['id'];
            $url = 'https://api.coinlore.net/api/ticker/?id='.$id;
            curl_setopt($curl, CURLOPT_URL,$url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $json = curl_exec($curl);
            if ("" != curl_error($curl)) {
                break;
            } else {
                $response = json_decode($json);
                $value_usd = $response['value_usd'];
                $updateQuery = "update crypto set value_usd = '$value_usd' where id = '$id';";
                $this->makeQuery($updateQuery);
            }
        }
        curl_close($curl);
    }

    public function getCryptos()
    {
        $query = "select * from crypto";
        return $this->makeQuery($query);
    }

    public function getCoins()
    {
        $query = "select * from coin";
        return $this->makeQuery($query);
    }


}