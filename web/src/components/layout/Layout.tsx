import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 pt-16 md:pt-0 md:ml-64">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
