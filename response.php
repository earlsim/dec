<?php
/**
 * Created by PhpStorm.
 * User: MAKS
 * Date: 24.02.2019
 * Time: 23:10
 */

/*
echo '<pre>';
print_r($_POST);
echo '</pre>';
exit;
 */

/*
$response = [
    'success' => false,
    'errors' => [
        'first_name' => ["Имя обязательно для заполнения"],
        'last_name' => ["Имя обязательно для заполнения"],
        'phone' => ["Имя обязательно для заполнения"],
        'email' => ["Email обязательно для заполнения"]
    ],
    'message' => ""
];
*/

/*
$response = [
    'success' => false,
    'errors' => [],
    'message' => "Товар добавлен в вашу корзину только на 5 минут"
];
 */

// Удаление из корзины
/*
$response = [
    'success' => true,
    'message' => "Товар удален из корзины",
    'data' => [
        "products" => [],
        "quantity" => 0,
        "sum" => 1500
    ]
];

// Feedback
$response = [
    'success' => true,
    'message' => "Мы свяжемся с вами в ближайшее время"
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);

exit();
 */

if ($_GET['test'] === "feedback") {
    $response = [
        'success' => true,
        'message' => "Спасибо за обращение, мы свяжемся с вами в ближайшее время!"
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "order") {
    $response = [
        'success' => true,
        'message' => "Спасибо за быстрый заказ, мы свяжемся с вами в ближайшее время!"
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "checkout") {
    $response = [
        'success' => true,
        'message' => "Спасибо за заказ, мы свяжемся с вами в ближайшее время!"
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "cart-add") {
    $response = [
        'success' => true,
        'message' => "Товар добавлен в корзину!",
        'data' => [
            'quantity' => 14,
            'sum' => 22680
        ]
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "cart-remove") {
    $response = [
        'success' => true,
        'message' => "Товар удален из корзины!",
        'data' => [
            'quantity' => 0,
            'sum' => 14670
        ]
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "favorites-add") {
    $response = [
        'success' => true,
        'message' => "Товар добавлен в избранное!"
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "favorites-delete") {
    $response = [
        'success' => true,
        'message' => "Товар удален из избранного!"
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "step-1") {
    $response = [
        'success' => true
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "step-2") {
    $response = [
        'success' => true
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "step-3") {
    $response = [
        'success' => true
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "step-4") {
    $response = [
        'success' => true
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else if ($_GET['test'] === "checkout") {
    $response = [
        'success' => true
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else {
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    echo "<pre>";
    print_r($_GET);
    echo "</pre>";
}
