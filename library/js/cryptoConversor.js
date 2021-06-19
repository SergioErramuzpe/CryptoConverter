$i = 0;
$k = 0;
$f = true;

$cryptoValues = [];
$cryptoSymbols = [];
$cryptoNames = [];
$cryptoIds = [];

$coinValues = [];
$coinSymbols = [];
$coinNames = [];

$optionText = ['Conversión de monedas a cryptomonedas','Conversión de cryptomonedas a monedas'];



$(document).ready(function() {

    $notApi = false;
    $isEuro = false;

    fetchCryptos();
    fetchCoins();
    fetchOptions();

    $(document).on('keyup', '.selectCrypto', (e) => {
        if (e.keyCode === 13) {
            if ($i === $cryptoIds.length)
                $i = 0;
            $cryptoSelect.value = $cryptoIds[$i];
            $cryptoSelect.innerText = $cryptoNames[$i];
            $cryptoSelect.name = $cryptoSymbols[$i];
            $i = $i+1;
        }
    });

    $(document).on('keyup', '.selectCoin', (e) => {
        if (e.keyCode === 13) {
            if ($k === $coinNames.length)
                $k = 0;
            $coinSelect.value = $coinValues[$k];
            $coinSelect.innerText = $coinNames[$k];
            $coinSelect.name = $coinSymbols[$k];
            $k = $k+1;
        }
    });

    $(document).on('keyup', '.selectOption', (e) => {
        if (e.keyCode === 13) {
            if ($f) {
                $optionSelect.value = 0;
                $optionSelect.innerText = $optionText[0];
                $f = false;
            } else {
                $optionSelect.value = 1;
                $optionSelect.innerText = $optionText[1];
                $f = true;
            }
        }
    });

    function fetchCryptos() {
        $cryptoSelect = document.getElementById('cryptoCoin');
        $.get('index.php',{'action':'cryptos'}, (response) => {
            $cryptos = JSON.parse(response);
            $cryptos.forEach(crypto => {
                $cryptoIds.push(crypto.id);
                $cryptoValues.push(crypto.value_usd);
                $cryptoSymbols.push(crypto.symbol);
                $cryptoNames.push(crypto.name);
            });
            $cryptoSelect.value = $cryptoIds[0];
            $cryptoSelect.innerText = $cryptoNames[0];
            $cryptoSelect.name = $cryptoSymbols[0];
        });
    }


    function fetchCoins() {
        $coinSelect = document.getElementById('coin');
        $.get('index.php',{'action':'coins'}, (response) => {
            const coins = JSON.parse(response);
            $k = 0;
            coins.forEach(coin => {
                $k = $k+1;
                $coinValues.push(coin.value_usd);
                $coinSymbols.push(coin.symbol);
                $coinNames.push(coin.name);
            });
            $coinSelect.value = $coinValues[0];
            $coinSelect.innerText = $coinNames[0];
            $coinSelect.name = $coinSymbols[0];
        });
    }

    function fetchOptions () {
        $optionSelect = document.getElementById('options');
        $optionSelect.value = 1;
        $optionSelect.innerText = $optionText[1];
    }



    $(document).on('click','.converter', (e) => {
        $selectedCrypto = document.getElementById('cryptoCoin');
        $selectedCoin = document.getElementById('coin');
        $cantity = document.getElementById('cantity').value;
        $valueUSD = $selectedCoin.value;
        $cryptoValueUSD = 0;

        /*CoinLore crypto getter*/
        const url = 'https://api.coinlore.net/api/ticker/?id='+$selectedCrypto.value;
        const http = new XMLHttpRequest();

        http.open("GET", url)
        http.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                $cryptoValueUSD = (JSON.parse(this.responseText))[0]['price_usd'];
                $notApi = false;
            } else {
                $cryptoValueUSD = $cryptoValues[$i];
                $notApi = true;
            }
            /*Euro converter selection requires usd-euro rate*/
            calculate();
        }
        http.send();
    });

    function calculate () {

        if ($f === true) {
            $conversion = $cantity*(1/$valueUSD)*$cryptoValueUSD;
            $result = $cantity+" "+$selectedCrypto.name+" = "+round($conversion)+" "+$selectedCoin.name;
        } else {
            $conversion = ($cantity*$valueUSD)/$cryptoValueUSD;
            $result = $cantity+" "+$selectedCoin.name+" = "+round($conversion)+" "+$selectedCrypto.name;
        }

        if ($notApi) {
            $result += "(Precio NO actualizado hace 3 horas)";
        }

        document.getElementById('result').innerHTML=$result;
    }

    /*Used StackOverflow function https://es.stackoverflow.com/questions/48958/redondear-a-dos-decimales-cuando-sea-necesario*/
    function round(num) {
        var decimal = num-Math.round(num);
        decimal = decimal*100;
        decimal = Math.round(decimal);
        return (Math.round(num)+(decimal/100));
    }

});

function clickCripto() {
    if ($i === $cryptoIds.length)
        $i = 0;
    $cryptoSelect.value = $cryptoIds[$i];
    $cryptoSelect.innerText = $cryptoNames[$i];
    $cryptoSelect.name = $cryptoSymbols[$i];
    $i = $i+1;
}

function clickCoin() {
    if ($k === $coinNames.length)
        $k = 0;
    $coinSelect.value = $coinValues[$k];
    $coinSelect.innerText = $coinNames[$k];
    $coinSelect.name = $coinSymbols[$k];
    $k = $k+1;
}

function clickOption() {
    if ($f) {
        $optionSelect.value = 0;
        $optionSelect.innerText = $optionText[0];
        $f = false;
    } else {
        $optionSelect.value = 1;
        $optionSelect.innerText = $optionText[1];
        $f = true;
    }
}
