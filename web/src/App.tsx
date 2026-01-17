import { Routes, Route, useParams, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api/client";
import { LoginPage } from "./features/auth/LoginPage.tsx";
import { RegisterPage } from "./features/auth/RegisterPage.tsx";
import { UnauthenticatedPage } from "./features/auth/UnauthenticatedPage.tsx";
import { LedgersPage } from "./features/ledgers/LedgersPage";
import { LedgerDetailPage } from "./features/ledgers/LedgerDetailPage";
import { ApiKeysPage } from "./features/api-keys/ApiKeysPage";
import { AccountsTable } from "./features/ledgers/AccountsTable";
import { WebhookLogsTable } from "./features/webhooks/WebhookLogsTable";
import { TransactionsPage } from "./features/transactions/TransactionsPage";
import { EventsPage } from "./features/events/EventsPage";
import { BalancePage } from "./features/balance/BalancePage";
import { HomePage } from "./features/home/HomePage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ApiKeyProvider } from "./contexts/ApiKeyContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { TestPage } from "./features/test/TestPage";

function ApiKeysPageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <ApiKeysPage ledgerID={ledgerID || ""} />;
}

function AccountsTableWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    const { data: ledger } = useQuery({
        queryKey: ["ledger", ledgerID],
        queryFn: () => apiClient.getLedger(ledgerID || ""),
        enabled: !!ledgerID,
    });
    return <AccountsTable ledgerID={ledgerID || ""} currency={ledger?.currency} />;
}

function TransactionsPageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <TransactionsPage ledgerID={ledgerID || ""} />;
}

function WebhookLogsTableWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <WebhookLogsTable ledgerID={ledgerID || ""} />;
}

function EventsPageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <EventsPage ledgerID={ledgerID || ""} />;
}

function BalancePageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <BalancePage ledgerID={ledgerID || ""} />;
}

function ProtectedLayout() {
    return (
        <RequireAuth>
            <Layout><Outlet /></Layout>
        </RequireAuth>
    );
}

function App() {
    return (
        <AuthProvider>
            <ApiKeyProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/unauthenticated" element={<UnauthenticatedPage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/" element={<ProtectedLayout />}>
                        <Route path="ledgers" element={<LedgersPage />} />
                        <Route path="ledgers/:ledgerID" element={<LedgerDetailPage />} />
                        <Route path="ledgers/:ledgerID/api-keys" element={<ApiKeysPageWithId />} />
                        <Route path="ledgers/:ledgerID/accounts" element={<AccountsTableWithId />} />
                        <Route path="ledgers/:ledgerID/transactions" element={<TransactionsPageWithId />} />
                        <Route path="ledgers/:ledgerID/webhooks" element={<WebhookLogsTableWithId />} />
                        <Route path="ledgers/:ledgerID/events" element={<EventsPageWithId />} />
                        <Route path="ledgers/:ledgerID/balance" element={<BalancePageWithId />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </ApiKeyProvider>
        </AuthProvider>
    );
}

export default App;
