<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flex:create-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or update the application administrator from the ADMIN_* environment variables';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = config('admin.email');
        $password = config('admin.password');

        if (! $email || ! $password) {
            $this->components->error('ADMIN_EMAIL and ADMIN_PASSWORD must be set.');

            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => config('admin.name', 'Super Administrator'),
                'password' => $password,
            ],
        );

        $created = $user->wasRecentlyCreated;

        if ($user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $this->components->info(
            $created
                ? "Created administrator {$email}."
                : "Updated administrator {$email}.",
        );

        return self::SUCCESS;
    }
}
