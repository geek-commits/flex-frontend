import { Head, Link } from '@inertiajs/react';
import { RiLoginBoxLine, RiUserAddLine } from '@remixicon/react';
import { FlexBrandLogo } from '@/components/flex/brand';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <main className="flex-1 flex items-center justify-center px-6 py-16">
                    <div className="flex flex-col items-center gap-6 max-w-md text-center">
                        <FlexBrandLogo width={196} variant="login" />

                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Flex Contact Center
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                A modern, high-utility contact center for agents, supervisors and administrators.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="default" className="gap-1.5" render={<Link href="/login" />}>
                                <RiLoginBoxLine className="size-4" />
                                Log in
                            </Button>
                            <Button variant="outline" className="gap-1.5" render={<Link href="/register" />}>
                                <RiUserAddLine className="size-4" />
                                Register
                            </Button>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Flex Contact Center. All rights reserved.
                </footer>
            </div>
        </>
    );
}
