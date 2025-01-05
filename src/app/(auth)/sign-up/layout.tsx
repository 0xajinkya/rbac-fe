import { SignUpLayout } from "@layout/sign-up";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SignUpLayout>
            {children}
        </SignUpLayout>
    );
}