import { AuthLayout } from "@layout/auth";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}