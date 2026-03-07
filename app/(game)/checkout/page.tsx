"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Preços ────────────────────────────────────────────────
const PRECOS: Record<string, number> = {
  genialidade: 12.9,
  curso: 4.9,
};

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Helpers de máscara ────────────────────────────────────
function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
function maskCEP(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}
function maskCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}
function maskExpiry(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d{1,2})$/, "$1/$2");
}
function maskCVV(v: string) {
  return v.replace(/\D/g, "").slice(0, 4);
}

// ── Estilos inline base ───────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid rgba(59,91,219,0.28)",
  background: "rgba(13,18,37,0.8)",
  color: "#E8EEFF",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#4A5680",
  marginBottom: 6,
  fontFamily: "'Space Grotesk', sans-serif",
};

// ── Campo de formulário ───────────────────────────────────
function Field({
  label,
  id,
  required,
  value,
  onChange,
  placeholder,
  style = {},
  inputMode,
  autoComplete,
}: {
  label: string;
  id: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={style}>
      <label htmlFor={id} style={labelStyle}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "#3B5BDB" : "rgba(59,91,219,0.28)",
          boxShadow: focused ? "0 0 0 3px rgba(59,91,219,0.18)" : "none",
        }}
      />
    </div>
  );
}

// ── Sidebar: Resumo ───────────────────────────────────────
function OrderSummary({
  produtoTipo,
  cursoId,
  price,
}: {
  produtoTipo: string;
  cursoId: string | null;
  price: number;
}) {
  const titulo =
    produtoTipo === "genialidade"
      ? "Zona de Genialidade"
      : `Curso — ${cursoId ?? "Especialização"}`;

  const subtitulo =
    produtoTipo === "genialidade"
      ? "Acesso vitalício ao método completo"
      : "Desbloqueio completo do curso";

  return (
    <div
      style={{
        background: "rgba(13,18,37,0.9)",
        border: "1px solid rgba(59,91,219,0.18)",
        borderRadius: 16,
        padding: 24,
        position: "sticky",
        top: 24,
      }}
    >
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: "#E8EEFF",
          marginBottom: 4,
        }}
      >
        Resumo do Pedido
      </h2>
      <p style={{ fontSize: 13, color: "#4A5680", marginBottom: 20 }}>
        Pagamento único, sem recorrência
      </p>

      {/* Produto */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(59,91,219,0.12)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(59,91,219,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#E8EEFF",
            }}
          >
            {titulo}
          </p>
          <p style={{ fontSize: 12, color: "#4A5680", marginTop: 2 }}>
            {subtitulo}
          </p>
        </div>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: 14,
            color: "#E8EEFF",
            flexShrink: 0,
          }}
        >
          {fmt(price)}
        </p>
      </div>

      {/* Total */}
      <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(59,91,219,0.12)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#7A8AAE",
            marginBottom: 10,
          }}
        >
          <span>Subtotal</span>
          <span>{fmt(price)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#E8EEFF",
          }}
        >
          <span>Total</span>
          <span style={{ color: "#5B7BFF" }}>{fmt(price)}</span>
        </div>
      </div>

      {/* Trust */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: 16,
          fontSize: 10,
          color: "#4A5680",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Criptografia SSL
      </div>

      {/* Métodos aceitos */}
      <div style={{ marginTop: 16 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#4A5680",
            marginBottom: 8,
          }}
        >
          Métodos aceitos:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Cartão", "Pix", "Boleto"].map((m) => (
            <span
              key={m}
              style={{
                fontSize: 11,
                color: "#7A8AAE",
                border: "1px solid rgba(59,91,219,0.18)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Etapa 1: Dados pessoais + Endereço ───────────────────
type StepOneData = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  terms: boolean;
};

function StepOne({
  data,
  onChange,
  onSubmit,
}: {
  data: StepOneData;
  onChange: (key: keyof StepOneData, value: string | boolean) => void;
  onSubmit: () => void;
}) {
  const [cepLoading, setCepLoading] = useState(false);

  const lookupCEP = useCallback(
    async (cep: string) => {
      const digits = cep.replace(/\D/g, "");
      if (digits.length !== 8) return;
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const json = await res.json();
        if (!json.erro) {
          onChange("street", json.logradouro || "");
          onChange("neighborhood", json.bairro || "");
          onChange("city", json.localidade || "");
          onChange("state", json.uf || "");
        }
      } catch {
        // silencioso
      } finally {
        setCepLoading(false);
      }
    },
    [onChange]
  );

  const handleCEP = (v: string) => {
    const masked = maskCEP(v);
    onChange("cep", masked);
    if (masked.replace(/\D/g, "").length === 8) lookupCEP(masked);
  };

  const isValid =
    data.name.trim().length > 3 &&
    data.cpf.replace(/\D/g, "").length === 11 &&
    data.phone.replace(/\D/g, "").length >= 10 &&
    data.email.includes("@") &&
    data.cep.replace(/\D/g, "").length === 8 &&
    data.street.trim().length > 1 &&
    data.number.trim().length > 0 &&
    data.terms;

  const grid2: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: "#E8EEFF",
    marginBottom: 16,
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: "#E8EEFF",
          marginBottom: 4,
        }}
      >
        Finalizar compra
      </h1>
      <p style={{ fontSize: 13, color: "#7A8AAE", marginBottom: 28 }}>
        Preencha seus dados para continuar
      </p>

      {/* Dados pessoais */}
      <p style={sectionTitle}>Dados pessoais</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
        <Field
          label="Nome completo"
          id="name"
          required
          value={data.name}
          onChange={(v) => onChange("name", v)}
          placeholder="Seu nome completo"
          autoComplete="name"
        />
        <div style={grid2}>
          <Field
            label="CPF"
            id="cpf"
            required
            value={data.cpf}
            onChange={(v) => onChange("cpf", maskCPF(v))}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
          <Field
            label="Celular"
            id="phone"
            required
            value={data.phone}
            onChange={(v) => onChange("phone", maskPhone(v))}
            placeholder="(00) 00000-0000"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
        <Field
          label="E-mail"
          id="email"
          required
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="seu@email.com"
          autoComplete="email"
        />
      </div>

      {/* Endereço */}
      <p style={{ ...sectionTitle, marginTop: 24 }}>Endereço de cobrança</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* CEP */}
        <div>
          <label style={labelStyle}>
            CEP <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="cep"
              type="text"
              inputMode="numeric"
              value={data.cep}
              onChange={(e) => handleCEP(e.target.value)}
              placeholder="00000-000"
              style={inputStyle}
            />
            {cepLoading && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid #3B5BDB",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={grid2}>
          <Field
            label="Logradouro"
            id="street"
            required
            value={data.street}
            onChange={(v) => onChange("street", v)}
            placeholder="Rua, Avenida, etc."
            autoComplete="street-address"
          />
          <Field
            label="Número"
            id="number"
            required
            value={data.number}
            onChange={(v) => onChange("number", v)}
            placeholder="123"
            inputMode="numeric"
          />
        </div>

        <div style={grid2}>
          <Field
            label="Bairro"
            id="neighborhood"
            required
            value={data.neighborhood}
            onChange={(v) => onChange("neighborhood", v)}
            placeholder="Seu bairro"
          />
          <Field
            label="Cidade"
            id="city"
            required
            value={data.city}
            onChange={(v) => onChange("city", v)}
            placeholder="Sua cidade"
            autoComplete="address-level2"
          />
        </div>

        <Field
          label="Complemento (opcional)"
          id="complement"
          value={data.complement}
          onChange={(v) => onChange("complement", v)}
          placeholder="Apto, Bloco, etc."
        />
      </div>

      {/* Termos */}
      <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <input
          id="terms"
          type="checkbox"
          checked={data.terms}
          onChange={(e) => onChange("terms", e.target.checked)}
          style={{ width: 16, height: 16, marginTop: 2, accentColor: "#3B5BDB", flexShrink: 0, cursor: "pointer" }}
        />
        <label
          htmlFor="terms"
          style={{ fontSize: 13, color: "#7A8AAE", cursor: "pointer", lineHeight: 1.6 }}
        >
          Confirmo que estou de acordo com a{" "}
          <span style={{ color: "#5B7BFF" }}>política de privacidade</span>
          {" "}e os{" "}
          <span style={{ color: "#5B7BFF" }}>termos de uso</span>
        </label>
      </div>

      {/* Trust */}
      <p
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#4A5680",
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Seus dados estão protegidos com criptografia SSL
      </p>

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={!isValid}
        style={{
          marginTop: 24,
          width: "100%",
          height: 52,
          borderRadius: 12,
          background: isValid
            ? "linear-gradient(135deg, #3B5BDB 0%, #5B7BFF 100%)"
            : "rgba(59,91,219,0.2)",
          color: isValid ? "#fff" : "#4A5680",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "none",
          cursor: isValid ? "pointer" : "not-allowed",
          boxShadow: isValid ? "0 4px 20px rgba(59,91,219,0.4)" : "none",
          transition: "all 0.2s",
        }}
      >
        Ir para o pagamento
      </button>
    </div>
  );
}

// ── Etapa 2: Pagamento ────────────────────────────────────
type PayMethod = "card" | "pix" | "boleto";

type AsaasResult = {
  metodo: PayMethod;
  pixQrCode?: string | null;
  pixCopyCola?: string | null;
  boletoUrl?: string | null;
  boletoLinhaDigitavel?: string | null;
};

function StepTwo({
  personalData,
  userId,
  produtoTipo,
  cursoId,
  price,
  onBack,
}: {
  personalData: StepOneData;
  userId: string;
  produtoTipo: string;
  cursoId: string | null;
  price: number;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<PayMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AsaasResult | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expMonth, expYear] = card.expiry.includes("/")
        ? card.expiry.split("/")
        : ["", ""];

      const res = await fetch("/api/asaas/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          produtoTipo,
          cursoId,
          nome: personalData.name,
          cpf: personalData.cpf,
          email: personalData.email,
          telefone: personalData.phone,
          cep: personalData.cep,
          logradouro: personalData.street,
          numero: personalData.number,
          bairro: personalData.neighborhood,
          cidade: personalData.city,
          estado: personalData.state,
          complemento: personalData.complement,
          metodo: method,
          cartaoNome: card.name,
          cartaoNumero: card.number,
          cartaoMes: expMonth,
          cartaoAno: expYear,
          cartaoCVV: card.cvv,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Erro ao processar pagamento");

      setResult({
        metodo: method,
        pixQrCode: data.pixQrCode,
        pixCopyCola: data.pixCopyCola,
        boletoUrl: data.boletoUrl,
        boletoLinhaDigitavel: data.boletoLinhaDigitavel,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Space Grotesk', sans-serif",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #3B5BDB" : "2px solid transparent",
    color: active ? "#5B7BFF" : "#4A5680",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  // ── Tela de resultado ─────────────────────────────────
  if (result) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        {result.metodo === "card" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: "#E8EEFF",
                marginBottom: 10,
              }}
            >
              Pagamento confirmado!
            </h2>
            <p style={{ fontSize: 14, color: "#7A8AAE", maxWidth: 340, margin: "0 auto 20px", lineHeight: 1.7 }}>
              Seu acesso foi desbloqueado. Pode fechar esta página e aproveitar seu conteúdo.
            </p>
            <div
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 12,
                padding: "14px 20px",
                maxWidth: 300,
                margin: "0 auto",
                fontSize: 13,
                color: "#7A8AAE",
              }}
            >
              Confirmação enviada para{" "}
              <strong style={{ color: "#E8EEFF" }}>{personalData.email}</strong>
            </div>
          </>
        )}

        {result.metodo === "pix" && (
          <>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: "#E8EEFF",
                marginBottom: 6,
              }}
            >
              Pague via Pix
            </h2>
            <p style={{ fontSize: 13, color: "#7A8AAE", marginBottom: 24 }}>
              Escaneie o QR Code ou copie o código abaixo
            </p>

            {result.pixQrCode ? (
              <img
                src={`data:image/png;base64,${result.pixQrCode}`}
                alt="QR Code Pix"
                style={{
                  width: 192,
                  height: 192,
                  margin: "0 auto 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(59,91,219,0.28)",
                  display: "block",
                  background: "#fff",
                }}
              />
            ) : (
              <div
                style={{
                  width: 192,
                  height: 192,
                  margin: "0 auto 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(59,91,219,0.18)",
                  background: "rgba(13,18,37,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ fontSize: 12, color: "#4A5680", textAlign: "center", padding: "0 16px" }}>
                  QR Code sendo gerado pelo Asaas...
                </p>
              </div>
            )}

            {result.pixCopyCola && (
              <div style={{ maxWidth: 360, margin: "0 auto" }}>
                <p style={{ fontSize: 12, color: "#4A5680", marginBottom: 8 }}>Pix Copia e Cola</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    readOnly
                    value={result.pixCopyCola}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      fontSize: 11,
                      height: 38,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(result.pixCopyCola!)}
                    style={{
                      padding: "0 16px",
                      height: 38,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #3B5BDB 0%, #5B7BFF 100%)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            <p style={{ marginTop: 20, fontSize: 12, color: "#4A5680" }}>
              Após o pagamento, o acesso é liberado automaticamente.
            </p>
          </>
        )}

        {result.metodo === "boleto" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: "#E8EEFF",
                marginBottom: 8,
              }}
            >
              Boleto gerado!
            </h2>
            <p style={{ fontSize: 13, color: "#7A8AAE", maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.7 }}>
              Vence em 3 dias úteis. Após o pagamento, aguarde até 3 dias úteis para a confirmação.
            </p>
            {result.boletoUrl && (
              <a
                href={result.boletoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #3B5BDB 0%, #5B7BFF 100%)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "0 4px 20px rgba(59,91,219,0.4)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Baixar boleto (PDF)
              </a>
            )}
            {result.boletoLinhaDigitavel && (
              <div style={{ maxWidth: 360, margin: "20px auto 0" }}>
                <p style={{ fontSize: 12, color: "#4A5680", marginBottom: 8 }}>Linha digitável</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    readOnly
                    value={result.boletoLinhaDigitavel}
                    style={{ ...inputStyle, flex: 1, fontSize: 11, height: 38 }}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(result.boletoLinhaDigitavel!)}
                    style={{
                      padding: "0 16px",
                      height: 38,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #3B5BDB 0%, #5B7BFF 100%)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const cardIsValid =
    method !== "card" ||
    (card.number.replace(/\s/g, "").length === 16 &&
      card.name.trim().length > 2 &&
      card.expiry.length === 5 &&
      card.cvv.length >= 3);

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: "#E8EEFF",
          marginBottom: 4,
        }}
      >
        Método de pagamento
      </h1>
      <p style={{ fontSize: 13, color: "#7A8AAE", marginBottom: 24 }}>
        Escolha como prefere pagar
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(59,91,219,0.18)",
          marginBottom: 28,
        }}
      >
        <button
          style={tabStyle(method === "card")}
          onClick={() => setMethod("card")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Cartão
        </button>
        <button
          style={tabStyle(method === "pix")}
          onClick={() => setMethod("pix")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Pix
        </button>
        <button
          style={tabStyle(method === "boleto")}
          onClick={() => setMethod("boleto")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Boleto
        </button>
      </div>

      {/* Cartão */}
      {method === "card" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>
              Número do cartão <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={card.number}
              onChange={(e) => setCard((p) => ({ ...p, number: maskCardNumber(e.target.value) }))}
              placeholder="0000 0000 0000 0000"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Nome no cartão <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              autoComplete="cc-name"
              value={card.name}
              onChange={(e) => setCard((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
              placeholder="Nome como está no cartão"
              style={inputStyle}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>
                Validade <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={card.expiry}
                onChange={(e) => setCard((p) => ({ ...p, expiry: maskExpiry(e.target.value) }))}
                placeholder="MM/AA"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                CVV <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={card.cvv}
                onChange={(e) => setCard((p) => ({ ...p, cvv: maskCVV(e.target.value) }))}
                placeholder="000"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pix */}
      {method === "pix" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(59,91,219,0.08)",
              border: "1px solid rgba(59,91,219,0.2)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 28,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontSize: 13, color: "#7A8AAE", fontWeight: 500 }}>
              Pagamento instantâneo! O QR Code é gerado ao clicar em "Gerar QR Code".
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 0" }}>
            <svg width="72" height="72" viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L75 35 L50 60 L25 35 Z" fill="#32BCAD" />
              <path d="M50 40 L75 65 L50 90 L25 65 Z" fill="#32BCAD" />
              <path d="M10 50 L35 25 L60 50 L35 75 Z" fill="#32BCAD" />
              <path d="M40 50 L65 25 L90 50 L65 75 Z" fill="#32BCAD" />
            </svg>
            <p style={{ fontSize: 13, color: "#7A8AAE", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
              Clique no botão abaixo para gerar o QR Code e pague pelo app do seu banco.
            </p>
          </div>
        </div>
      )}

      {/* Boleto */}
      {method === "boleto" && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p style={{ fontSize: 13, color: "#7A8AAE", lineHeight: 1.6 }}>
            O boleto vence em 3 dias úteis. Após o pagamento, a compensação pode levar até 3 dias úteis para o acesso ser liberado.
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontSize: 13, color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Trust */}
      <p
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#4A5680",
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Seus dados estão protegidos com criptografia SSL
      </p>

      {/* Botões */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <button
          onClick={onBack}
          style={{
            height: 52,
            borderRadius: 12,
            background: "rgba(59,91,219,0.08)",
            border: "1px solid rgba(59,91,219,0.2)",
            color: "#7A8AAE",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !cardIsValid}
          style={{
            height: 52,
            borderRadius: 12,
            background:
              loading || !cardIsValid
                ? "rgba(59,91,219,0.2)"
                : "linear-gradient(135deg, #3B5BDB 0%, #5B7BFF 100%)",
            color: loading || !cardIsValid ? "#4A5680" : "#fff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            border: "none",
            cursor: loading || !cardIsValid ? "not-allowed" : "pointer",
            boxShadow: loading || !cardIsValid ? "none" : "0 4px 20px rgba(59,91,219,0.4)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Processando...
            </>
          ) : method === "card" ? (
            `Pagar ${fmt(price)}`
          ) : method === "pix" ? (
            `Gerar QR Code (${fmt(price)})`
          ) : (
            `Gerar boleto (${fmt(price)})`
          )}
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const produtoTipo = searchParams.get("produto") ?? "genialidade";
  const cursoId = searchParams.get("cursoId");

  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<StepOneData>({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    terms: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!session) {
        router.push("/login?redirect=/checkout");
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? "");
      setForm((prev) => ({ ...prev, email: session.user.email ?? "" }));
      setLoading(false);
    });
  }, [router]);

  const handleChange = useCallback(
    (key: keyof StepOneData, value: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const price = PRECOS[produtoTipo] ?? 12.9;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(59,91,219,0.3)",
            borderTopColor: "#3B5BDB",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  const stepBubble = (n: number, active: boolean, done: boolean): React.CSSProperties => ({
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    background: done ? "#10b981" : active ? "#3B5BDB" : "rgba(59,91,219,0.15)",
    color: done || active ? "#fff" : "#4A5680",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingTop: 32,
        paddingBottom: 60,
      }}
    >
      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "#E8EEFF",
                letterSpacing: "-0.02em",
              }}
            >
              Sirius Academy
            </span>
          </div>

          {/* Progress steps */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                color: step === 1 ? "#5B7BFF" : "#4A5680",
              }}
            >
              <div style={stepBubble(1, step === 1, step === 2)}>
                {step === 2 ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              Dados pessoais
            </div>
            <div style={{ width: 40, height: 1, background: "rgba(59,91,219,0.2)" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                color: step === 2 ? "#5B7BFF" : "#4A5680",
              }}
            >
              <div style={stepBubble(2, step === 2, false)}>2</div>
              Pagamento
            </div>
          </div>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main card */}
          <div
            style={{
              background: "rgba(13,18,37,0.9)",
              border: "1px solid rgba(59,91,219,0.18)",
              borderRadius: 16,
              padding: 32,
            }}
          >
            {step === 1 ? (
              <StepOne
                data={form}
                onChange={handleChange}
                onSubmit={async () => {
                  // Salva lead silenciosamente (não bloqueia o fluxo)
                  fetch('/api/asaas/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId,
                      nome: form.name,
                      email: form.email,
                      telefone: form.phone,
                      produtoTipo,
                      cursoId,
                    }),
                  }).catch(() => {}) // silencioso
                  setStep(2)
                }}
              />
            ) : (
              <StepTwo
                personalData={form}
                userId={userId!}
                produtoTipo={produtoTipo}
                cursoId={cursoId}
                price={price}
                onBack={() => setStep(1)}
              />
            )}
          </div>

          {/* Sidebar */}
          <OrderSummary produtoTipo={produtoTipo} cursoId={cursoId} price={price} />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid rgba(59,91,219,0.3)",
              borderTopColor: "#3B5BDB",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
