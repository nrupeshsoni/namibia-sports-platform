import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { fadeUp } from "@/lib/animations";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [federationId, setFederationId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();
  const federationsQuery = trpc.federations.list.useQuery({});
  const federations = federationsQuery.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error: err } = await signUp(email, password, name || undefined);
    setIsSubmitting(false);
    if (err) {
      setError(err.message ?? "Failed to register");
      return;
    }
    setLocation("/");
  };

  const handleGoogle = async () => {
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) setError(err.message ?? "Failed to sign in with Google");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header
        className="border-b"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <button
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors p-2 rounded-xl"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <h1 className="text-2xl font-serif text-white mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            Join the Namibia Sports community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label className="text-gray-300">Federation (optional)</Label>
              <Select value={federationId} onValueChange={setFederationId}>
                <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select federation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {federations.map((fed) => (
                    <SelectItem key={fed.id} value={String(fed.id)}>
                      {fed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
                color: "white",
              }}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={handleGoogle}
          >
            Google
          </Button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-red-400 hover:text-red-300">Sign In</a>
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
