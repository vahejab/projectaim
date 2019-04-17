<?php
    abstract class api
    {
        protected $endpoint = array();
        protected $verb = '';
        protected $args = array();
        protected $file = null;
        protected $id = null;
        
        public function __construct($request){
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: *");
            header("Content-Type: application/json");
           
           $this->args = $request;
           if (array_key_exists('endpoint', $this->args)){
                  $this->endpoint[] = $this->args['endpoint'];
                  unset($this->args['endpoint']);
            }
            $keys = array_keys($this->args); 
            if (count($this->args) > 0)
            {
                $first = $keys[0];
                $validKey = array_key_exists($first, $this->args);
                $isNumeric =  $validKey && is_numeric($this->args[$first]);
                switch(count($this->args)){
                    case 1:
                        if ($isNumeric)
                            $this->id = $this->args[$first];
                        break; 
                    case 2: 
                        if ($isNumeric){
                            $this->id = $this->args[$first];   
                            array_shift($this->args);
                        }
                        if (array_key_exists('endpoint2', $this->args))
                            $this->endpoint[] = $this->args['endpoint2'];
                        break;
                } 
            }
           
            $this->method = $_SERVER['REQUEST_METHOD'];
            
            if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
                if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                    $this->method = 'DELETE';
                } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                    $this->method = 'PUT';
                } else {
                    throw new Exception("Unexpected Header");
                }
            }
      
            switch($this->method) {
                case 'DELETE':
                case 'POST':
                    $this->request = $this->_cleanInputs($_POST);
                    break;
                case 'GET':
                    $this->request = $this->_cleanInputs($_GET);
                    //echo json_encode($this->request, JSON_PRETTY_PRINT);
                    break;
                case 'PUT':
                    $this->request = $this->_cleanInputs($_GET);
                    $this->file = file_get_contents("php://input");
                    break;
                default:
                    $this->_response('Invalid Method', 405);
                    break;
            }
            
            return $this->request;
        }  
        
        public function processRequest() {
            if(count($this->endpoint) > 0){
                $class = "{$this->endpoint[0]}Controller";
                if (class_exists($class, true)){
                        $method = strtolower($this->method);
                        if (method_exists($class, $method))
                            $args = $this->args;
                            $id = $this->id;
                            $endpoint2 =  $this->endpoint[1] ?? null;
                            return $this->_response((new $class($args,$endpoint2))->{$method}($id));
                }
                return $this->_response("No Endpoint: {$this->endpoint[0]}", 404);
            }
        }

        private function _response($data, $status = 200) {
            header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
            return json_encode($data, JSON_PRETTY_PRINT);
        }
  
        
        private function _cleanInputs($data){
            $clean_input = array();
            if (is_array($data)){
                foreach ($data as $k => $v) {
                    $clean_input[$k] = $this->_cleanInputs($v);
                }
            } else {
                $clean_input = trim(strip_tags($data));
            }
            return $clean_input;
        }    
        
        private function _requestStatus($code){
            $status = array (
                200 => 'OK',
                404 => 'Not Found',
                405 => 'Method Not Allowed',
                500 => 'Internal Server Error'
            );
            return ($status[$code])?$status[$code]:$status[500];
        }
    }