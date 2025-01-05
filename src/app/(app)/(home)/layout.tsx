import { HomeLayout } from "@layout/home";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    )
}