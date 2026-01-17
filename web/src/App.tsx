import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { LedgersPage } from "./features/ledgers/LedgersPage";
import { LedgerDetailPage } from "./features/ledgers/LedgerDetailPage";
import { ApiKeysPage } from "./features/api-keys/ApiKeysPage";
import { AccountsTable } from "./features/ledgers/AccountsTable";
import { WebhookLogsTable } from "./features/webhooks/WebhookLogsTable";
import { TransactionsPage } from "./features/transactions/TransactionsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { Layout } from "./components/layout/Layout";
import { TestPage } from "./features/test/TestPage";

function ApiKeysPageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <ApiKeysPage ledgerID={ledgerID || ""} />;
}

function AccountsTableWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <AccountsTable ledgerID={ledgerID || ""} />;
}

function WebhookLogsTableWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <WebhookLogsTable ledgerID={ledgerID || ""} />;
}

function TransactionsPageWithId() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    return <TransactionsPage ledgerID={ledgerID || ""} />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/ledgers" replace />} />
                <Route path="ledgers" element={<LedgersPage />} />
                <Route path="ledgers/:ledgerID" element={<LedgerDetailPage />} />
                <Route path="ledgers/:ledgerID/api-keys" element={<ApiKeysPageWithId />} />
                <Route path="ledgers/:ledgerID/accounts" element={<AccountsTableWithId />} />
                <Route path="ledgers/:ledgerID/transactions" element={<TransactionsPageWithId />} />
                <Route path="ledgers/:ledgerID/webhooks" element={<WebhookLogsTableWithId />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
}

export default App;
