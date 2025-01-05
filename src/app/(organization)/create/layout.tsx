import { CreateOrgLayout } from "@layout/create-org"
import { ReactNode } from "react"

export default function Layout({
    children
}: {
    children: ReactNode
}) {
    return (
        <CreateOrgLayout>
            {children}
        </CreateOrgLayout>
    )
}