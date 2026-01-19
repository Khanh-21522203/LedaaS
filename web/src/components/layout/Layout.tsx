import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
            <Sidebar />
            <main className="flex-1 pt-16 md:pt-0 md:ml-64">
                <div className="p-8">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
