
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    GraduationCap,
    ArrowRight,
} from "lucide-react";
import { authClient, signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setIsLoading(true);

            // Authenticate user
            const { error } = await signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Unable to sign in.");
                return;
            }

            // Retrieve JWT
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                toast.error("Unable to retrieve authentication token.");
                return;
            }

            toast.success("Welcome back!");

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign in error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-140px)] bg-background px-4 py-12 sm:py-16">
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-slate-900/5 md:grid-cols-2">

                {/* Left Panel */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex lg:p-12">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
                    <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[45px] border-white/10" />

                    <div className="relative z-10">
                        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                            <GraduationCap size={32} />
                        </div>

                        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
                            Welcome back to your learning journey.
                        </h1>

                        <p className="mt-6 max-w-sm text-base leading-7 text-white/85">
                            Connect with the right tutors, discover opportunities,
                            and make every learning moment count.
                        </p>
                    </div>

                    <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-5">
                        <p className="text-lg font-semibold">
                            Learn better. Grow faster.
                        </p>
                        <p className="mt-2 text-sm text-white/80">
                            Your next learning opportunity is just one step away.
                        </p>
                    </div>
                </div>

                {/* Sign In Form */}
                <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
                    <div className="w-full max-w-md">

                        <div className="mb-8">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary md:hidden">
                                <GraduationCap size={26} />
                            </div>

                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                                MentorLagbe
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                Sign in to your account
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Enter your credentials to access your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-foreground"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={19} />

                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-input bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-foreground"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={19} />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-input bg-background py-3.5 pl-12 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs text-muted-foreground">
                                NEW TO MENTORLAGBE?
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="font-semibold text-primary transition hover:underline"
                            >
                                Create account
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </main>
    );
}
