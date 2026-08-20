<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Administrator
    |--------------------------------------------------------------------------
    |
    | The administrator account created by the `flex:create-admin` command.
    | Credentials are supplied through environment variables so secrets are
    | never committed to the repository.
    |
    */

    'name' => env('ADMIN_NAME', 'Super Administrator'),

    'email' => env('ADMIN_EMAIL'),

    'password' => env('ADMIN_PASSWORD'),

];
