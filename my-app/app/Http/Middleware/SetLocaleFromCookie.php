<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleFromCookie
{
    /**
     * Handle an incoming request - bridge frontend locale to Laravel.
     *
     * Strict allowlist ['en','sw','fr']; unsupported/missing values safely
     * fall back to the application's default locale without exposing file
     * path or authorization state.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('flex_locale');

        if (is_string($locale) && in_array($locale, ['en', 'sw', 'fr'], true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
