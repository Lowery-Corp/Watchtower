import AuthLayout from "../layouts/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
export default function AuthPage({ onLogin }) { return <AuthLayout><AuthForm onLogin={onLogin} /></AuthLayout>; }
