import { Link, router, usePage } from '@inertiajs/react';
import { RiLogoutBoxRLine, RiShieldUserLine, RiUserSettingsLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { AccountAvatar } from '@/components/flex/account-avatar';
import { MyRoleAccess } from '@/components/flex/my-role-access';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

const ROLE_LABELS: Record<string, string> = {
    'super-admin': 'Super Administrator',
    admin: 'Administrator',
    supervisor: 'Supervisor',
    agent: 'Agent',
};

function roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? 'Super Administrator';
}

/**
 * Canonical top-right account/profile control. Strictly scopes to personal
 * identity (avatar + name + email + role badge), profile settings, personal
 * access inspection, and session termination. System administration routes
 * belong exclusively in workspace navigation rails.
 */
export function FlexProfileMenu() {
    const { auth } = usePage().props;
    const user = auth?.user as User | undefined;
    const { role } = useCapabilities();
    const getInitials = useInitials();
    const cleanup = useMobileNavigation();
    const [roleAccessOpen, setRoleAccessOpen] = useState(false);

    if (!user) {
        return null;
    }

    const initials = getInitials(user.name || 'Gad Josephat');

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center justify-center size-8 rounded-full bg-transparent p-0 outline-none transition-colors hover:bg-flex-layer-hover focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    aria-label="Open profile menu"
                >
                    <AccountAvatar size="default" className="size-8" src={user.avatar ?? null} initials={initials} alt="" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-72">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-2 py-2">
                                <AccountAvatar size="lg" src={user.avatar ?? null} initials={initials} alt={user.name ?? ''} />
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-foreground" title={user.name}>
                                        {user.name}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground" title={user.email}>
                                        {user.email}
                                    </div>
                                    <div className="mt-1">
                                        <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                            {roleLabel(role)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            render={
                                <Link
                                    className="block w-full cursor-pointer"
                                    href={edit()}
                                    prefetch
                                    onClick={cleanup}
                                >
                                    <RiUserSettingsLine className="mr-2" />
                                    Profile settings
                                </Link>
                            }
                        />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setRoleAccessOpen(true)}
                        >
                            <RiShieldUserLine className="mr-2" />
                            My role &amp; access
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
                            nativeButton
                            render={
                                <Link
                                    className="block w-full cursor-pointer"
                                    href={logout()}
                                    as="button"
                                    onClick={handleLogout}
                                    data-test="topbar-logout-button"
                                >
                                    <RiLogoutBoxRLine className="mr-2" />
                                    Sign out
                                </Link>
                            }
                        />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <MyRoleAccess open={roleAccessOpen} onOpenChange={setRoleAccessOpen} />
        </>
    );
}