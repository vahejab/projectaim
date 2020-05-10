<?php
    abstract class api
    {
        protected $endpoint = array();
        protected $method = '';
        protected $verb = '';
        protected $args = array();
        protected $payload = null;
        protected $id = null;
        
        public function __construct($request){
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: *"); 
           
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
                $isNavigationKey = !$isNumeric && in_array(strtolower($this->args[$first]), ['first', 'prev', 'next', 'last']);
                switch(count($this->args)){
                    case 1:
                        if ($isNumeric || $isNavigationKey)
                            $this->id = $this->args[$first];
                        break; 
                    case 2: 
                        if ($isNumeric || $isNavigationKey){
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
                    $this->payload = $this->_cleanInputs(file_get_contents('php://input'));
                    $this->payload = json_decode($this->payload, true);
                    break;
                case 'GET':
                    $this->request = $this->_cleanInputs($_GET);
                    //echo json_encode($this->request, JSON_PRETTY_PRINT);
                    break;
                case 'PUT': 
                    $this->payload = $this->_cleanInputs(file_get_contents('php://input'));
                    $this->payload = json_decode($this->payload, true);
                    $this->request = $this->payload;
                    break;
                default:
                    $this->_response('Invalid Method', 405);
                    break;
            }                       
            return $this->request;
        }  
        
        public function processRequest() {
            $endpointCount = count($this->endpoint);
            if($endpointCount <= 2){
                $isDestination = $endpointCount == 2 && in_array($this->endpoint[1], ['first', 'prev', 'next', 'last']);
                $class = '';
                if ($endpointCount == 1)
                    $class = "\\controllers\\{$this->endpoint[0]}Controller";
                else if ($endpointCount == 2 && !$isDestination)
                    $class = "\\controllers\\{$this->endpoint[1]}Controller";  
                else if ($endpointCount == 2 && $isDestination)
                    $class = "\\controllers\\{$this->endpoint[0]}Controller";
                       
                if (class_exists($class, true))
                {
                    $method = strtolower($this->method); 
                    if (method_exists($class, $method)){
                        $args = $this->args;
                        $id = $this->id;
                        if ($isDestination)
                            $endpoint2 = $this->endpoint[1] ?? null;
                        else if ($endpointCount == 1)
                            $endpoint2 =  $this->endpoint[1] ?? null;
                        else if ($endpointCount  == 2)
                            $endpoint2 =  $this->endpoint[0] ?? null;
                        $payload = $this->payload;
  
                        if ($endpoint2 == 'first' || $endpoint2 == 'last'){
                            $goto = $endpoint2;
                            $response = (new $class($args,$endpoint2,$payload))->{$method}($goto);
                        }
                        else if ($endpoint2 == 'prev' || $endpoint2 == 'next'){
                            $goto = $endpoint2;
                            $response = (new $class($args,$endpoint2,$payload))->{$method}($id, $goto);
                        }
                        else {        
                            $response = (new $class($args,$endpoint2,$payload))->{$method}($id);   //here id can be numeric or 'first', or 'last' possibly
                        }
                           
                        if ($response['Succeeded'] == false){
                            return $response['Result'];
                        }
                        else if ($response['Succeeded']== true){    
                            header("Content-Type: application/json");
                            return $this->_response($response);
                        }
                        else if ($response['Result']){
                            header("Content-Type: application/html");
                            return $this->response($response);
                        } 
                    }
                }
                if ($this->endpoint){
                    if ($isDestination)
                        return $this->_response("No Endpoint: ", $this->endpoint[0]);
                    return $this->_response("No Endpoint: " . $this->endpoint[1] ?? $this->endpoint[0]);
                }
                else
                    return $this->_response("ProjectAIM API");
            }
        }

        private function _response($data, $status = 200) {
            header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
            return json_encode($data, JSON_NUMERIC_CHECK);
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
                400 => 'Bad Request',
                404 => 'Not Found',
                405 => 'Method Not Allowed',
                500 => 'Internal Server Error'
            );
            return ($status[$code])?$status[$code]:$status[500];
        }
    }