<?php


class View
{

    private $name;

    public function __construct ($viewName) {
        $this->name = $viewName;
    }

    function render()  {
        $header = $this->getHtml("header");
        $header = str_replace("##page##",$this->getHtml($this->name),$header);
        echo $header;
    }

    private function getHtml($name) {
        return file_get_contents('./core/templates/'.$name.'.html');
    }

}