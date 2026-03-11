import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { QUIZ_SECTIONS } from '@/lib/genius-quiz-data'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function buildAnswerSummary(answers: Record<string, string | string[]>): string {
  const lines: string[] = []

  for (const section of QUIZ_SECTIONS) {
    lines.push(`\n### ${section.title} (${section.framework})`)
    for (const q of section.questions) {
      const ans = answers[q.id]
      if (!ans || ans === ' ') continue
      lines.push(`P: ${q.text}`)
      lines.push(`R: ${Array.isArray(ans) ? ans.join(', ') : ans}`)
    }
  }

  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const { answers, userId } = await req.json()

    if (!answers || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const answerSummary = buildAnswerSummary(answers)

    const prompt = `Você é um especialista em mapeamento de potencial humano, coach de alto desempenho e estrategista de negócios. Com base nas respostas do assessment abaixo, gere um GENIUS ZONE BLUEPRINT detalhado e personalizado.

## RESPOSTAS DO ASSESSMENT:
${answerSummary}

## INSTRUÇÕES:
Gere um blueprint em markdown com EXATAMENTE estas 10 seções, preenchidas com análise PROFUNDA e PERSONALIZADA baseada nas respostas (não genérica):

---

# GENIUS ZONE BLUEPRINT

## 1. IDENTIDADE ESTRATÉGICA
Descreva em 2-3 parágrafos quem é esta pessoa baseado no padrão geral das respostas. Identifique o arquétipo principal.

## 2. ZONA DE GÊNIO (Gay Hendricks)
- **Zona Atual Identificada:** [Gênio / Excelência / Competência / Incompetência]
- **Análise Detalhada:** 2 parágrafos sobre onde a pessoa opera e por quê
- **Upper Limit Problem Detectado:** Identifique o padrão de autossabotagem se houver
- **Caminho para a Zona de Gênio:** 3 ações concretas

## 3. FORÇAS CLIFTONSTRENGTHS
- **Domínio Primário:** [Execução / Influência / Relacionamentos / Pensamento Estratégico]
- **Top 5 Forças Estimadas:** Liste com breve descrição de cada uma
- **Como Usar no Dia a Dia:** Aplicação prática com IA

## 4. HABILIDADE ÚNICA (Dan Sullivan)
- **Definição da Habilidade Única:** Escreva em 1-2 frases precisas
- **Por que é única:** Explique o que a diferencia
- **Atividades de Delegação:** O que delegar para fazer mais da Habilidade Única
- **IA como Amplificador:** Como usar IA para multiplicar esta habilidade

## 5. PERFIL DE RIQUEZA (Wealth Dynamics)
- **Perfil Identificado:** [Creator / Star / Supporter / Deal Maker / Trader / Accumulator / Lord / Mechanic]
- **Análise do Perfil:** 2 parágrafos sobre como este perfil cria valor
- **Fluxo Natural de Riqueza:** Como este perfil naturalmente gera receita
- **Armadilhas do Perfil:** O que evitar

## 6. EQUAÇÃO DE VALOR (Alex Hormozi)
- **Desejo Identificado:** O que seu cliente realmente quer
- **Estratégia de Valor:** Como maximizar o valor entregue
- **Posicionamento Hormozi:** Descreva o "Grand Slam Offer" desta pessoa
- **Proposta de Valor em 1 Frase:**

## 7. MODO DE AÇÃO KOLBE
- **Modo Primário:** [Quick Start / Fact Finder / Follow Thru / Implementor]
- **Estilo de Execução:** Como esta pessoa age sob pressão
- **Ambiente Ideal:** Como estruturar o trabalho para maximizar o modo
- **Complemento de Equipe:** Quem contratar para compensar

## 8. POSICIONAMENTO DE FASCÍNIO (Sally Hogshead)
- **Vantagem Primária:**
- **Vantagem Secundária:**
- **Personalidade de Marca:** Arquétipo de como a pessoa é percebida
- **Como Fascinar no Mercado:** 3 estratégias específicas

## 9. SQUAD DE IA RECOMENDADO
Com base no perfil completo, liste 5 agentes de IA específicos que esta pessoa deveria usar mais, com justificativa baseada na Zona de Gênio identificada:
1. [Agente] — [Por quê]
2. ...

## 10. PLANO DE AÇÃO 90 DIAS
### Mês 1 — Fundação (Dias 1-30)
- 3 ações concretas

### Mês 2 — Expansão (Dias 31-60)
- 3 ações concretas

### Mês 3 — Escala (Dias 61-90)
- 3 ações concretas

**Missão Central em 1 frase:**
> [Escreva a missão central desta pessoa em termos de impacto, habilidade única e IA]

---

IMPORTANTE: Seja específico e baseado nas respostas. Evite generalidades. Cada seção deve parecer escrita especificamente para esta pessoa.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const blueprint = (message.content[0] as { text: string }).text

    // Save to Supabase
    const { error } = await supabase.from('genius_blueprints').upsert({
      user_id: userId,
      blueprint_md: blueprint,
      generated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save blueprint' }, { status: 500 })
    }

    return NextResponse.json({ success: true, blueprint })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Analysis error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
