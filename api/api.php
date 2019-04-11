<?php
    require_once 'vendor/autoloader.php';
    $requestURI = $_GET;
    
    $method = strtolower($_SERVER['REQUEST_METHOD']);
    header('Content-Type: application/json');
    switch ($method){
        case 'get':
            echo json_encode($requestURI, JSON_PRETTY_PRINT);
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