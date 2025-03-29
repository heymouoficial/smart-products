import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from 'react-feather';
import { User } from 'react-feather';
import { Link } from 'react-router-dom';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
          <User size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-sora text-[#f7f7f7]">SmartProduct</h1>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button 
          variant={isLogin ? "default" : "outline"} 
          onClick={() => setIsLogin(true)}
        >
          Iniciar sesión
        </Button>
        <Button 
          variant={!isLogin ? "default" : "outline"} 
          onClick={() => setIsLogin(false)}
        >
          Registrarse
        </Button>
      </div>
      <form onSubmit={isLogin ? handleEmailLogin : handleSignUp} className="space-y-4 w-full">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </Button>
        {isLogin && (
          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continuar con
          </span>
        </div>
      </div>

      

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
    </div>
  );
}