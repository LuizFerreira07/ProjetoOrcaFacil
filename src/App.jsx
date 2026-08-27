import { useState, useMemo, useEffect } from "react";
import {
  Sun, Moon, Search, ArrowDownLeft, ArrowUpRight, Plus, ArrowLeft, Eye, EyeOff,
  Home as HomeIcon, Utensils, Car, ShoppingBag, HeartPulse, GraduationCap,
  Popcorn, Receipt, Package, Wallet, Zap, TrendingUp, Gift, CircleDollarSign, ChevronRight, X, LogOut, User,
  UserPlus, Loader2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

const SAIDA_CATEGORIES = [
  { id: "alimentacao", label: "Alimentação", icon: Utensils, color: "#F97316", bg: "#FFEDD5" },
  { id: "transporte", label: "Transporte", icon: Car, color: "#3B82F6", bg: "#DBEAFE" },
  { id: "moradia", label: "Moradia", icon: HomeIcon, color: "#8B5CF6", bg: "#EDE9FE" },
  { id: "compras", label: "Compras", icon: ShoppingBag, color: "#EC4899", bg: "#FCE7F3" },
  { id: "saude", label: "Saúde", icon: HeartPulse, color: "#EF4444", bg: "#FEE2E2" },
  { id: "educacao", label: "Educação", icon: GraduationCap, color: "#6366F1", bg: "#E0E7FF" },
  { id: "lazer", label: "Lazer", icon: Popcorn, color: "#A855F7", bg: "#F3E8FF" },
  { id: "contas", label: "Contas", icon: Receipt, color: "#F59E0B", bg: "#FEF3C7" },
  { id: "outros", label: "Outros", icon: Package, color: "#6B7280", bg: "#F3F4F6" },
];

const ENTRADA_CATEGORIES = [
  { id: "salario", label: "Salário", icon: Wallet, color: "#0D9488", bg: "#CCFBF1" },
  { id: "freelance", label: "Freelance", icon: Zap, color: "#0EA5E9", bg: "#E0F2FE" },
  { id: "investimentos", label: "Investimentos", icon: TrendingUp, color: "#2563EB", bg: "#DBEAFE" },
  { id: "presente", label: "Presente", icon: Gift, color: "#16A34A", bg: "#DCFCE7" },
  { id: "outras_entradas", label: "Outras entradas", icon: CircleDollarSign, color: "#059669", bg: "#D1FAE5" },
];

const ALL_CATEGORIES = [...SAIDA_CATEGORIES, ...ENTRADA_CATEGORIES];
const catById = (id) => ALL_CATEGORIES.find((c) => c.id === id);

const fmt = (n) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function DateChip({ label, active, onClick, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-80 active:scale-95 ${
        active 
          ? "bg-emerald-800 text-white" 
          : isDark 
            ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-750" 
            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryChip({ cat, active, onClick, isDark }) {
  const Icon = cat.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 pl-2 pr-3 py-2 rounded-full text-sm font-medium border transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
        active 
          ? "text-white border-transparent" 
          : isDark 
            ? "bg-gray-800 text-gray-200 border-gray-700 hover:border-gray-600" 
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
      }`}
      style={active ? { backgroundColor: cat.color } : {}}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: active ? "rgba(255,255,255,0.25)" : cat.bg }}
      >
        <Icon size={12} style={{ color: active ? "#fff" : cat.color }} strokeWidth={2.5} />
      </span>
      {cat.label}
    </button>
  );
}

function AuthShell({ isDark, onToggleTheme, icon, title, subtitle, children }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 w-full h-full min-h-screen">
      <div className="absolute top-6 right-5">
        <button onClick={onToggleTheme} className="text-gray-400 hover:text-amber-500 transition-colors p-2">
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className={`w-full max-w-sm rounded-3xl p-8 shadow-lg border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
            {icon}
          </div>
        </div>
        <h1 className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        <p className={`text-center text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function AuthField({ label, isDark, ...inputProps }) {
  return (
    <div>
      <label className={`text-sm font-semibold mb-1.5 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <input
        {...inputProps}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-shadow ${
          isDark
            ? "bg-gray-950 border-gray-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        }`}
      />
    </div>
  );
}

function LoginScreen({ onGoToRegister, isDark, onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : signInError.message
      );
    }
  };

  return (
    <AuthShell
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      icon={<User size={32} />}
      title="Bem-vindo"
      subtitle="Faça login para gerenciar suas finanças"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <AuthField
          label="E-mail"
          isDark={isDark}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          required
        />
        <AuthField
          label="Senha"
          isDark={isDark}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-4 rounded-xl font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Ainda não tem conta?{" "}
        <button
          type="button"
          onClick={onGoToRegister}
          className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
        >
          Cadastre-se
        </button>
      </p>
    </AuthShell>
  );
}

function RegisterScreen({ onGoToLogin, onRegistered, isDark, onToggleTheme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (name.trim().length < 2) {
      setError("Digite seu nome completo.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "Já existe uma conta com esse e-mail."
          : signUpError.message
      );
      return;
    }

    if (data.session) {
      onRegistered();
    } else {
      setInfo("Cadastro feito! Verifique seu e-mail para confirmar a conta antes de entrar.");
    }
  };

  return (
    <AuthShell
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      icon={<UserPlus size={32} />}
      title="Criar conta"
      subtitle="Cadastre-se para começar a controlar suas finanças"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <AuthField
          label="Nome completo"
          isDark={isDark}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
        />
        <AuthField
          label="E-mail"
          isDark={isDark}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          required
        />
        <AuthField
          label="Senha"
          isDark={isDark}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
        />
        <AuthField
          label="Confirmar senha"
          isDark={isDark}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repita a senha"
          required
        />

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
        {info && <p className="text-emerald-600 text-sm font-medium text-center">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-4 rounded-xl font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Já tem conta?{" "}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
        >
          Fazer login
        </button>
      </p>
    </AuthShell>
  );
}

function NewTransactionScreen({ onCancel, onSave, initialType = "saida", isDark, onToggleTheme }) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    initialType === "saida" ? SAIDA_CATEGORIES[0].id : ENTRADA_CATEGORIES[0].id
  );
  const [dateOpt, setDateOpt] = useState("hoje");
  const [description, setDescription] = useState("");

  const categories = type === "saida" ? SAIDA_CATEGORIES : ENTRADA_CATEGORIES;

  const handleTypeChange = (t) => {
    setType(t);
    setCategory(t === "saida" ? SAIDA_CATEGORIES[0].id : ENTRADA_CATEGORIES[0].id);
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setAmount(raw);
  };

  const numericAmount = () => {
    if (!amount) return 0;
    return parseFloat(amount.replace(/\./g, "").replace(",", ".")) || 0;
  };

  const dateLabel = { hoje: "Hoje", ontem: "Ontem", outra: "Outra data" }[dateOpt];
  const canSave = numericAmount() > 0;

  return (
    <div className={`flex flex-col flex-1 h-full w-full min-h-screen md:items-center md:justify-center md:py-12 md:px-6 transition-colors duration-300 ${isDark ? 'md:bg-gray-950' : 'md:bg-[#F7F8F6]'}`}>
      <div className={`flex flex-col w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-3xl md:shadow-2xl md:border flex-shrink-0 transition-colors duration-300 ${
        isDark ? "bg-gray-950 md:bg-gray-900 md:border-gray-800 text-white" : "bg-[#F7F8F6] md:bg-white md:border-gray-200 text-gray-900"
      }`}>
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 md:border-b md:border-gray-100 dark:md:border-gray-800">
          <button onClick={onCancel} className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"} hover:scale-110 transition-all p-1`}>
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-base font-semibold">Nova transação</h1>
          <button onClick={onToggleTheme} className="text-gray-400 hover:text-amber-500 transition-colors p-1 md:hidden">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Content Scrollável */}
        <div className="px-5 space-y-5 flex-1 overflow-y-auto pb-6 md:pt-6 custom-scrollbar">
          <div className={`flex rounded-2xl p-1 ${isDark ? "bg-gray-900 md:bg-gray-950" : "bg-gray-100 md:bg-gray-50"}`}>
            <button
              onClick={() => handleTypeChange("saida")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                type === "saida" ? "bg-red-500 text-white shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowUpRight size={16} /> Saída
            </button>
            <button
              onClick={() => handleTypeChange("entrada")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                type === "entrada" ? "bg-emerald-800 text-white shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowDownLeft size={16} /> Entrada
            </button>
          </div>

          <div className={`rounded-2xl border p-6 text-center shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <p className="text-xs tracking-wide text-gray-400 mb-2">VALOR DA TRANSAÇÃO</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold" style={{ color: type === "saida" ? "#EF4444" : "#10B981" }}>
                R$
              </span>
              <input
                autoFocus
                value={amount}
                onChange={handleAmountChange}
                placeholder="0,00"
                inputMode="decimal"
                className="text-4xl font-bold text-center w-40 outline-none bg-transparent placeholder-gray-500 transition-colors"
                style={{ color: type === "saida" ? "#EF4444" : "#10B981" }}
              />
            </div>
          </div>

          <div>
            <p className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Categoria</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <CategoryChip key={c.id} cat={c} active={category === c.id} onClick={() => setCategory(c.id)} isDark={isDark} />
              ))}
            </div>
          </div>

          <div>
            <p className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Data</p>
            <div className="flex gap-2">
              <DateChip label="Hoje" active={dateOpt === "hoje"} onClick={() => setDateOpt("hoje")} isDark={isDark} />
              <DateChip label="Ontem" active={dateOpt === "ontem"} onClick={() => setDateOpt("ontem")} isDark={isDark} />
              <DateChip label="Outra data" active={dateOpt === "outra"} onClick={() => setDateOpt("outra")} isDark={isDark} />
            </div>
          </div>

          <div>
            <p className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Descrição</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Ex.: ${type === "saida" ? "Mercado da semana" : "Salário de agosto"}`}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-shadow ${
                isDark 
                  ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-600" 
                  : "bg-white border-gray-200 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1.5">Opcional — se ficar em branco usamos o nome da categoria.</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-5 pb-6 pt-4 space-y-3 md:border-t md:border-gray-100 dark:md:border-gray-800">
          <button
            disabled={!canSave}
            onClick={() =>
              canSave &&
              onSave({
                type,
                category,
                amount: numericAmount(),
                date: dateLabel,
                description: description || catById(category).label,
              })
            }
            className={`w-full py-3.5 rounded-2xl font-semibold text-white transition-all active:scale-[0.98] ${
              canSave ? "bg-emerald-800 hover:bg-emerald-900 shadow-md" : "bg-emerald-800/40 cursor-not-allowed"
            }`}
          >
            Salvar transação
          </button>
          <button onClick={onCancel} className={`w-full text-center text-sm py-1 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ user, onLogout, transactions, onNew, showAll, setShowAll, isDark, onToggleTheme }) {
  const [hideBalance, setHideBalance] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.description.toLowerCase().includes(q) || 
      catById(t.category).label.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  const totalEntradas = useMemo(
    () => transactions.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  
  const totalSaidas = useMemo(
    () => transactions.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  
  const saldo = totalEntradas - totalSaidas;
  const usedPct = totalEntradas > 0 ? Math.min(100, (totalSaidas / totalEntradas) * 100) : 0;

  const byCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "saida")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([id, amount]) => ({ cat: catById(id), amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions]);

  const visible = isSearching || showAll ? filteredTransactions : filteredTransactions.slice(0, 8);
  const hasActiveSearch = isSearching && searchQuery.trim().length > 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const monthName = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
      <div className="max-w-7xl mx-auto w-full">
        {/* HEADER DE BUSCA E NAVEGAÇÃO */}
        <div className="px-5 md:px-8 pt-6 pb-4 flex items-center justify-between min-h-[85px]">
          {isSearching ? (
            <div className={`flex-1 flex items-center border rounded-full px-4 py-2.5 shadow-sm transition-all duration-300 ${isDark ? "bg-gray-900 border-emerald-600" : "bg-white border-emerald-500"}`}>
              <Search size={18} className="text-emerald-500 mr-2 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar por descrição ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? "text-white placeholder-gray-500" : "text-gray-800"}`}
              />
              <button 
                onClick={() => { setIsSearching(false); setSearchQuery(""); }}
                className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all p-1 shrink-0 ml-1"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs text-gray-400">{greeting}, {user}</p>
                <h1 className="text-xl md:text-2xl font-bold cursor-default">Minhas finanças</h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4 text-gray-400">
                <button onClick={onToggleTheme} className="hover:text-amber-500 hover:scale-110 transition-all p-2">
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                  onClick={() => setIsSearching(true)} 
                  className="hover:text-emerald-500 hover:scale-110 transition-all p-2"
                >
                  <Search size={20} />
                </button>
                <button 
                  onClick={onLogout} 
                  className="hover:text-red-500 hover:scale-110 transition-all p-2"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* LAYOUT PRINCIPAL (GRID 100% RESPONSIVO) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 px-5 md:px-8 pb-24 md:pb-12 mt-2">
          
          {/* COLUNA ESQUERDA: DASHBOARD E BOTÕES (Some na busca em telas pequenas, fica fixo nas grandes) */}
          {(!hasActiveSearch || window.innerWidth >= 768) && (
            <div className="md:col-span-5 lg:col-span-4 relative">
              <div className="flex flex-col gap-6 md:sticky md:top-6 transition-all duration-300">
                
                {/* CARD SALDO */}
                <div
                  className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
                  style={{ background: isDark ? "linear-gradient(135deg, #154D35 0%, #09261A 100%)" : "linear-gradient(135deg, #1F6B4A 0%, #0F3D2A 100%)" }}
                >
                  <div className="flex items-center justify-between text-xs text-emerald-100/80 mb-4">
                    <span className="flex items-center gap-1.5 font-medium tracking-wide">
                      <Wallet size={14} /> SALDO DE {monthName.toUpperCase()}
                    </span>
                    <button 
                      onClick={() => setHideBalance((v) => !v)}
                      className="hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                      {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    {hideBalance ? "R$ ••••••" : `R$ ${fmt(saldo)}`}
                  </p>
                  <div className="h-1.5 bg-white/20 rounded-full mb-1.5 overflow-hidden">
                    <div className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out" style={{ width: `${usedPct}%` }} />
                  </div>
                  <p className="text-xs text-emerald-100/80 mb-5">
                    Você já usou {usedPct.toFixed(0)}% do que entrou neste mês
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/10 hover:bg-white/20 transition-colors cursor-default rounded-2xl p-3 md:p-4">
                      <p className="text-xs text-emerald-100/80 flex items-center gap-1 mb-1">
                        <ArrowDownLeft size={14} /> Entradas
                      </p>
                      <p className="font-semibold text-sm md:text-base">R$ {fmt(totalEntradas)}</p>
                    </div>
                    <div className="flex-1 bg-white/10 hover:bg-white/20 transition-colors cursor-default rounded-2xl p-3 md:p-4">
                      <p className="text-xs text-emerald-100/80 flex items-center gap-1 mb-1">
                        <ArrowUpRight size={14} /> Saídas
                      </p>
                      <p className="font-semibold text-sm md:text-base">R$ {fmt(totalSaidas)}</p>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onNew("entrada")}
                    className={`flex-1 border rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 ${
                      isDark 
                        ? "bg-gray-900 border-gray-800 text-emerald-400 hover:border-emerald-800" 
                        : "bg-white border-gray-100 text-emerald-800 hover:border-emerald-200"
                    }`}
                  >
                    <ArrowDownLeft size={16} /> Nova entrada
                  </button>
                  <button
                    onClick={() => onNew("saida")}
                    className={`flex-1 border rounded-2xl py-3.5 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 ${
                      isDark 
                        ? "bg-gray-900 border-gray-800 text-red-400 hover:border-red-900" 
                        : "bg-white border-gray-100 text-red-500 hover:border-red-200"
                    }`}
                  >
                    <ArrowUpRight size={16} /> Nova saída
                  </button>
                </div>

                {/* CATEGORIAS (PARA ONDE FOI) */}
                <div>
                  <h2 className="font-bold text-lg">Para onde foi</h2>
                  <p className="text-xs text-gray-400 mb-3">Gastos de {monthName}</p>
                  <div className={`rounded-3xl border p-5 space-y-5 shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                    {byCategory.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-3">Nenhuma saída registrada ainda.</p>
                    )}
                    {byCategory.map(({ cat, amount }) => {
                      const Icon = cat.icon;
                      const pct = totalSaidas > 0 ? (amount / totalSaidas) * 100 : 0;
                      return (
                        <div key={cat.id} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`flex items-center gap-3 text-sm font-medium transition-colors ${isDark ? "text-gray-200 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900"}`}>
                              <span className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: cat.bg }}>
                                <Icon size={16} style={{ color: cat.color }} />
                              </span>
                              {cat.label}
                            </span>
                            <span className="text-sm font-semibold">R$ {fmt(amount)}</span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ml-11 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            />
                          </div>
                          <p className="text-right text-xs font-medium text-gray-400 mt-1">{pct.toFixed(0)}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COLUNA DIREITA: LISTA DE TRANSAÇÕES */}
          <div className={hasActiveSearch ? "col-span-1 md:col-span-12" : "md:col-span-7 lg:col-span-8"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {hasActiveSearch ? "Resultados da busca" : "Transações recentes"}
              </h2>
              {!showAll && !isSearching && transactions.length > 8 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm font-semibold text-emerald-500 flex items-center hover:text-emerald-400 transition-colors bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-full"
                >
                  Ver todas <ChevronRight size={16} className="ml-0.5" />
                </button>
              )}
            </div>
            
            {hasActiveSearch && (
              <p className="text-sm text-gray-400 mb-4 font-medium">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}

            <div className={`rounded-3xl border overflow-hidden shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              {filteredTransactions.length === 0 ? (
                 <div className="p-10 text-center text-gray-400">
                   <Package size={40} className="mx-auto mb-3 opacity-50" />
                   <p className="text-base font-medium">Nenhuma transação encontrada</p>
                 </div>
              ) : (
                visible.map((t, index) => {
                  const cat = catById(t.category);
                  const Icon = cat.icon;
                  const isLast = index === visible.length - 1;
                  return (
                    <div 
                      key={t.id} 
                      className={`flex items-center gap-4 p-4 md:p-5 transition-colors cursor-pointer ${
                        isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50"
                      } ${!isLast ? (isDark ? "border-b border-gray-800" : "border-b border-gray-50") : ""}`}
                    >
                      <span
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.bg }}
                      >
                        <Icon size={20} style={{ color: cat.color }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold truncate md:text-lg">{t.description}</p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {cat.label} · {t.date}
                        </p>
                      </div>
                      <p
                        className="text-base md:text-lg font-bold shrink-0"
                        style={{ color: t.type === "saida" ? "#EF4444" : "#10B981" }}
                      >
                        {t.type === "saida" ? "− " : "+ "}R$ {fmt(t.amount)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* FAB - Só aparece no Mobile já que telas grandes têm os botões visíveis no painel lateral */}
      <button
        onClick={() => onNew("saida")}
        className="fixed bottom-6 right-5 md:hidden bg-emerald-800 text-white rounded-full pl-4 pr-5 py-3.5 flex items-center gap-1.5 font-semibold shadow-lg hover:bg-emerald-900 hover:scale-105 hover:shadow-xl transition-all active:scale-95 z-50"
      >
        <Plus size={18} strokeWidth={2.5} /> Nova
      </button>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = ainda carregando, null = deslogado
  const [profileName, setProfileName] = useState("");
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register"
  const [transactions, setTransactions] = useState([]); // INICIALIZANDO VAZIO AQUI
  const [screen, setScreen] = useState("home");
  const [defaultType, setDefaultType] = useState("saida");
  const [showAll, setShowAll] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Verifica a sessão atual e escuta mudanças de login/logout do Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Busca o nome cadastrado na tabela profiles (com fallback pros metadados/e-mail)
  useEffect(() => {
    const user = session?.user;
    if (!user) {
      setProfileName("");
      return;
    }

    setProfileName(user.user_metadata?.full_name || user.email || "");

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.full_name) setProfileName(data.full_name);
      });
  }, [session]);

  const currentUser = session?.user ? profileName : null;

  const handleSave = (t) => {
    setTransactions((prev) => [{ id: Date.now(), ...t }, ...prev]);
    setScreen("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen("home");
    setAuthScreen("login");
  };

  if (session === undefined) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-[#F7F8F6]"}`}>
        <Loader2 size={28} className="animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    // Removido as travas max-w-sm e bordas rígidas de layout
    <div className={`min-h-screen w-full font-sans relative transition-colors duration-300 flex flex-col ${isDark ? "bg-gray-950 text-white" : "bg-[#F7F8F6] text-gray-900"}`}>
      {!currentUser ? (
        authScreen === "login" ? (
          <LoginScreen
            onGoToRegister={() => setAuthScreen("register")}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <RegisterScreen
            onGoToLogin={() => setAuthScreen("login")}
            onRegistered={() => setAuthScreen("login")}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        )
      ) : screen === "home" ? (
        <HomeScreen
          user={currentUser}
          onLogout={handleLogout}
          transactions={transactions}
          onNew={(type) => {
            setDefaultType(type);
            setScreen("new");
          }}
          showAll={showAll}
          setShowAll={setShowAll}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <NewTransactionScreen 
          onCancel={() => setScreen("home")} 
          onSave={handleSave} 
          initialType={defaultType} 
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}