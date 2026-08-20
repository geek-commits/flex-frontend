<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('creates the administrator from the environment configuration', function () {
    config()->set('admin.name', 'Test Admin');
    config()->set('admin.email', 'admin@example.com');
    config()->set('admin.password', 'secret-password');

    $this->artisan('flex:create-admin')->assertSuccessful();

    $user = User::where('email', 'admin@example.com')->firstOrFail();

    expect($user->name)->toBe('Test Admin')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('secret-password', $user->password))->toBeTrue();
});

it('is idempotent and updates the existing administrator', function () {
    config()->set('admin.email', 'admin@example.com');
    config()->set('admin.password', 'first-password');

    $this->artisan('flex:create-admin')->assertSuccessful();
    $this->artisan('flex:create-admin')->assertSuccessful();

    expect(User::where('email', 'admin@example.com')->count())->toBe(1);

    config()->set('admin.password', 'second-password');

    $this->artisan('flex:create-admin')->assertSuccessful();

    $user = User::where('email', 'admin@example.com')->firstOrFail();

    expect(Hash::check('second-password', $user->password))->toBeTrue();
});

it('fails when the administrator credentials are not configured', function () {
    config()->set('admin.email', null);
    config()->set('admin.password', null);

    $this->artisan('flex:create-admin')->assertFailed();

    expect(User::count())->toBe(0);
});
