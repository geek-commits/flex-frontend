import { Link, router, usePage } from '@inertiajs/react';
import { RiLogoutBoxRLine, RiShieldUserLine, RiSettings4Line, RiUserSettingsLine, RiStore3Line } from '@remixicon/react';
import React, { useState } from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { MyRoleAccess } from '@/components/flex/my-role-access';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { roles, tenants } from '@/routes/admin';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

const ROLE_LABELS: Record<string, string> = {
    'super-admin': 'Super Administrator',
    admin: 'Administrator',
    agent: 'Agent',
};

function roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? 'Super Administrator';
}

/**
 * Canonical top-right account/profile control. Separates identity (avatar +
 * name + role) from role/access and tenant/platform context (adjacent trigger).
 */
export function FlexProfileMenu() {
    const { auth } = usePage().props;
    const user = auth?.user as User | undefined;
    const { role, has } = useCapabilities();
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
                    className="flex items-center justify-center size-8 rounded-full bg-transparent p-0 outline-none transition-colors hover:bg-flex-layer-hover focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open profile menu"
                >
                    <Avatar size="default" className="size-8">
                        {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-72">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-2 py-2">
                                <Avatar size="lg">
                                    {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-foreground" title={user.name}>
                                        {user.name}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground" title={user.email}>
                                        {user.email}
                                    </div>
                                    <div className="truncate text-[11px] font-medium text-status-info mt-0.5">
                                        {roleLabel(role)}
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
                                    View profile
                                </Link>
                            }
                        />
                        <DropdownMenuItem
                            render={
                                <Link
                                    className="block w-full cursor-pointer"
                                    href={edit()}
                                    prefetch
                                    onClick={cleanup}
                                >
                                    <RiSettings4Line className="mr-2" />
                                    Account settings
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

                    {has('roles.manage') && (
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                render={
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={roles()}
                                        prefetch
                                        onClick={cleanup}
                                    >
                                        <RiShieldUserLine className="mr-2" />
                                        Roles &amp; permissions
                                    </Link>
                                }
                            />
                            <DropdownMenuItem
                                render={
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={tenants()}
                                        prefetch
                                        onClick={cleanup}
                                    >
                                        <RiStore3Line className="mr-2" />
                                        Tenant administration
                                    </Link>
                                }
                            />
                        </DropdownMenuGroup>
                    )}

                    {has('roles.manage') && <DropdownMenuSeparator />}

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
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