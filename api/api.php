<?php
    $requestURI = $_GET;
    
    $method = strtolower($_SERVER['REQUEST_METHOD']);
    switch ($method){
        case 'get':
             //var_dump($_GET);
             echo json_encode($requestURI);
            break;
        case 'post':
            echo json_encode($requestURI);
            break;
        case 'put':
            echo json_encode($requestURI);
            break;
        case 'delete':
            echo json_encode($requestURI);
            break;
        default:
            // unimplemented method
            http_response_code(405);
    }