"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Mail, Lock, Loader2, School, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/admin/students");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/30 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl dark:bg-purple-900/20" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-900/20" />
      
      <div className="w-full max-w-md z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 dark:border-gray-800 transition-all duration-500 hover:shadow-3xl relative overflow-hidden group">
          {/* Card accent glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
          
          <CardHeader className="text-center space-y-6 pb-8 pt-10 relative">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/25 dark:shadow-blue-900/25 transform group-hover:scale-105 transition-transform duration-500">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <School size={48} className="text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent leading-tight">
                SchoolSync Pro
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300/80 text-lg font-medium">
                Welcome back to your dashboard
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sign in to continue your management journey
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-10 relative">
            <form className="space-y-7" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm p-4 rounded-2xl text-center backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="font-semibold mb-1">Authentication Error</div>
                  <div>{error}</div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 px-5 bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 dark:focus:ring-blue-500/30 transition-all duration-300 rounded-2xl shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <Input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 px-5 bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 dark:focus:ring-blue-500/30 transition-all duration-300 rounded-2xl shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group/btn"
                disabled={isLoading}
                variant="gradient"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover/btn:from-blue-500 group-hover/btn:via-indigo-500 group-hover/btn:to-violet-500 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100/50 dark:border-gray-800/50">
              <div className="text-center space-y-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Demo Access
                </p>
                <div className="space-y-3">
                  <div className="text-sm bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 px-5 py-3.5 rounded-2xl text-left font-medium border border-blue-100 dark:border-blue-900/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-bold">Administrator</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">admin@school.edu</div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">admin123</div>
                  </div>
                  
                  <div className="text-sm bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-950/30 dark:to-green-950/30 px-5 py-3.5 rounded-2xl text-left font-medium border border-emerald-100 dark:border-emerald-900/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="font-bold">Teaching Staff</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">teacher@school.edu</div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">teacher123</div>
                  </div>
                  
                  <div className="text-sm bg-gradient-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/30 px-5 py-3.5 rounded-2xl text-left font-medium border border-violet-100 dark:border-violet-900/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 mb-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      <span className="font-bold">Student Access</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">student@school.edu</div>
                    <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">student123</div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 pt-3">
                  Use these credentials for testing purposes only
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}