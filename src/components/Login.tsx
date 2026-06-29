import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { ContentInput } from "./ui/ContentInput";
import Email from "./ui/EmailRegister";
import { Resend } from 'resend';
import { usePostApi } from "@/hooks/usePostApi";
import { Dialog } from "./ui/Dialog";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [samePassword, setSamePassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [confirmMessage, setConfirmMessage]= useState(false)
  const [pwMismatch, setPwMismatch] = useState(false);
  const navigate = useNavigate()

  const { post, errorPost, loadingPost } = usePostApi()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result =await post(
      "/api/auth/login",
      { email, password },
    )
    if (result) { 
      navigate("/properties")
    }
    
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== samePassword) {
      setPwMismatch(true);
      return;
    }
    setPwMismatch(false);
    const result = await post(
      "/api/auth/register",
      { name, email, password, role: "owner" },
    );

    if (result) {
      setConfirmMessage(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <Card className="w-full max-w-sm p-6 flex flex-col gap-4">

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); }}
            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${mode === "login" ? "bg-white font-medium shadow-sm" : "text-gray-500"
              }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => { setMode("register") }}
            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${mode === "register" ? "bg-white font-medium shadow-sm" : "text-gray-500"
              }`}
          >
            Inscription
          </button>
        </div>

        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <ContentInput>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </ContentInput>
            <ContentInput>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </ContentInput>
            {errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
            <Button type="submit" disabled={loadingPost} className="w-full">
              {loadingPost ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <ContentInput>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </ContentInput>
            <ContentInput>
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </ContentInput>
            <ContentInput>
              <Label htmlFor="reg-password">Mot de passe</Label>
              <div className="relative">  
              <Input
                id="reg-password"
                type={showPw ?"text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                  className="pr-9"
                />
                <Button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </ContentInput>
            <ContentInput>
              <Label htmlFor="reg-password">Confirmer votre mot de passe</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={samePassword}
                  onChange={(e) => setSamePassword(e.target.value)}
                  required
                  className="pr-9"
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPw(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </ContentInput>

            <Button type="submit" disabled={loadingPost} className="w-full">
              {loadingPost ? "Inscription..." : "Créer un compte"}
            </Button>
            {pwMismatch && (
              <p className="text-red-500 text-sm">⚠️ Les mots de passe ne correspondent pas.</p>
            )}
            {confirmMessage && (
              <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-green-700 text-sm">
                <p>
                  Un mail de confirmation a été envoyé à <strong>{email}</strong>
                  <br/>(si vous ne le trouver pas, regardez dans vos spams)
                </p>
              </div>
            )}

            {errorPost && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-600 text-sm">
                <span>⚠️</span>
                <p>{errorPost}</p>
              </div>
            )}
          </form>
        )}

      </Card>
    </div>
  );
};