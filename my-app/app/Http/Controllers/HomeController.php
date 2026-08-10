<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Home landing. Authenticated users go straight to the dashboard;
     * guests see a minimal token-based public page.
     */
    public function index(Request $request)
    {
        if ($request->user()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('welcome');
    }
}
