import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { LedgersPage } from "./features/ledgers/LedgersPage";
import { ApiKeysPage } from "./features/api-keys/ApiKeysPage";
import { AccountsTable } from "./features/ledgers/AccountsTable";
import { WebhookLogsTable } from "./features/webhooks/WebhookLogsTable";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ledgers" element={<LedgersPage />} />
            <Route path="/ledgers/:ledgerID/api-keys" element={<ApiKeysPage ledgerID="TODO" />} />
            <Route path="/ledgers/:ledgerID/accounts" element={<AccountsTable ledgerID="TODO" />} />
            <Route path="/ledgers/:ledgerID/webhooks" element={<WebhookLogsTable ledgerID="TODO" />} />
            <Route path="/" element={<Navigate to="/ledgers" replace />} />
        </Routes>
    );
}

export default App;