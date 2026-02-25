import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
            <AuthForm type="register" />
        </div>
    );
}
