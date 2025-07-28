// src/components/LoginSection.tsx
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { BiLogOut } from "react-icons/bi";

type Props = {
    user: any;
    setUser: (user: any) => void;
};

function LoginSection({ user, setUser }: Props) {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user); // App.tsx に渡す
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    return (
        <div className="py-6 flex flex-col items-center justify-center gap-4">
            {user ? (
                <div className="flex flex-col items-center justify-center gap-4 text-white">
                    <p className="text-lg font-semibold text-center">
                        こんにちは、{user.displayName} さん
                    </p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#232323] hover:bg-[#444444] transition"
                    >
                        <BiLogOut className="text-xl" />
                        <span>ログアウト</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full max-w-xs py-3 px-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                        <FcGoogle className="text-xl mr-3" />
                        <span className="text-gray-700 font-medium">Googleでログイン</span>
                    </button>
                </div>
            )}
        </div>
    );

}

export default LoginSection;
