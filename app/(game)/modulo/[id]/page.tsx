'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PHASES, type Module, type QuizQuestion } from '@/lib/game-data'
import { CheckCircle2, ArrowRight, Trophy, TrendingUp, Target, Lightbulb, Copy, Check } from 'lucide-react'

function findModule(id: string): { module: Module; phaseId: number } | null {
  for (const phase of PHASES) {
    const module = phase.modules.find(m => m.id === id)
    if (module) return { module, phaseId: phase.id }
  }
  return null
}

// ── Quiz Component ──────────────────────────────────────────
function QuizGame({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [wrongIdx, setWrongIdx] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const q = questions[current]
  const letters = ['A', 'B', 'C', 'D']

  function handleSelect(oi: number) {
    if (answered) return
    setSelected(oi)
    setAnswered(true)
    if (oi === q.correct) {
      setScore(s => s + 1)
    } else {
      setWrongIdx(oi)
      setTimeout(() => setWrongIdx(null), 600)
    }
  }

  function handleNext() {
    const nextIdx = current + 1
    if (nextIdx >= questions.length) {
      setFinalScore(score + (selected === q.correct ? 0 : 0))
      setFinished(true)
      onComplete(score)
    } else {
      setCurrent(nextIdx)
      setSelected(null)
      setAnswered(false)
      setWrongIdx(null)
    }
  }

  if (finished) {
    const total = questions.length
    const pct = Math.round((score / total) * 100)
    return (
      <div style={{ animation: 'pop-in 0.4s ease' }}>
        <div style={{
          background: 'rgba(59,91,219,0.08)',
          border: '1px solid rgba(59,91,219,0.25)',
          borderRadius: 12, padding: '28px 32px',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            {pct >= 80
              ? <Trophy size={44} color="#f59e0b" strokeWidth={1.4} />
              : pct >= 50
              ? <TrendingUp size={44} color="#3B5BDB" strokeWidth={1.4} />
              : <Target size={44} color="var(--text-secondary)" strokeWidth={1.4} />
            }
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            {score}/{total}
          </div>
          <div style={{ color: '#6B7A9E', fontSize: 14, marginBottom: 16 }}>
            {pct >= 80 ? 'Excelente! Você dominou o conteúdo.' : pct >= 50 ? 'Bom trabalho! Continue praticando.' : 'Continue estudando e tente novamente.'}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,91,219,0.15)', border: '1px solid rgba(59,91,219,0.3)',
            borderRadius: 20, padding: '6px 18px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color: '#93c5fd',
          }}>
            +{score * 25} XP
          </div>
        </div>
      </div>
    )
  }

  const isCorrect = answered && selected === q.correct
  const isWrong = answered && selected !== q.correct

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span className="section-label">QUIZ</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B7A9E' }}>
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Question */}
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 16,
        lineHeight: 1.55, marginBottom: 20, color: '#E8EEFF',
      }}>
        {q.question}
      </p>

      {/* Options 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {q.options.map((opt, oi) => {
          const isCorrectOpt = answered && oi === q.correct
          const isWrongOpt = answered && selected === oi && oi !== q.correct
          const isSelectedOpt = selected === oi && !answered

          return (
            <button
              key={oi}
              onClick={() => handleSelect(oi)}
              disabled={answered}
              className={`quiz-option${isCorrectOpt ? ' correct' : isWrongOpt || oi === wrongIdx ? ' wrong' : isSelectedOpt ? ' selected' : ''}`}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: isCorrectOpt ? 'rgba(16,185,129,0.25)' : isWrongOpt ? 'rgba(239,68,68,0.2)' : 'rgba(12,21,102,0.6)',
                border: `1px solid ${isCorrectOpt ? 'rgba(16,185,129,0.5)' : isWrongOpt ? 'rgba(239,68,68,0.4)' : 'rgba(12,21,102,0.8)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
                color: isCorrectOpt ? '#34d399' : isWrongOpt ? '#f87171' : '#6B7A9E',
              }}>
                {letters[oi]}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="quiz-feedback">
          <div style={{
            padding: '14px 18px', borderRadius: 8, marginBottom: 16,
            background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
              color: isCorrect ? '#34d399' : '#f87171',
              letterSpacing: '0.06em', marginBottom: 6,
            }}>
              {isCorrect ? '✓ CORRETO!' : '✗ ERRADO!'}
            </div>
            <p style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {q.explanation}
            </p>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ fontSize: 14, padding: '11px 24px' }}>
            {current + 1 >= questions.length ? 'Ver resultado →' : 'Próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Terminal Block Component ─────────────────────────────────
function TerminalBlock({ label, children }: { label?: string; children: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="terminal-block">
      <div className="terminal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          {label && <span className="terminal-label">{label}</span>}
        </div>
        <button
          onClick={handleCopy}
          title="Copiar prompt"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(59,91,219,0.12)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(59,91,219,0.25)'}`,
            borderRadius: 6,
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: 11,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: copied ? '#10b981' : '#7B9FFF',
          }}
        >
          {copied
            ? <><Check size={12} strokeWidth={2.5} /> Copiado</>
            : <><Copy size={12} strokeWidth={2} /> Copiar</>
          }
        </button>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  )
}

// ── AI Concept Cards Component ────────────────────────────────
function AIConceptCards({ phase }: { phase: string }) {
  // Cards de contexto visual por fase — substitua os src pelas imagens geradas
  const cards = [
    {
      badge: phase.toUpperCase() + ' SOZINHO',
      title: 'Você trabalhando sem IA',
      desc: 'Esforço máximo, resultado limitado',
      gradient: 'linear-gradient(135deg, #0a0a14 0%, #0d1533 100%)',
    },
    {
      badge: phase.toUpperCase() + ' + AIOS',
      title: 'Você + Exército de Agentes',
      desc: 'Mesma estratégia, resultado amplificado',
      gradient: 'linear-gradient(135deg, #0a0a14 0%, #0c1560 60%, #1a2870 100%)',
    },
  ]

  return (
    <div className="ai-image-grid">
      {cards.map((card, i) => (
        <div key={i} className="ai-image-card" style={{ background: card.gradient }}>
          {/* Placeholder visual — substitua por <img src="..." /> */}
          <div className="ai-image-overlay" />
          <div className="ai-image-content">
            <div className="ai-image-badge">{card.badge}</div>
            <div className="ai-image-title">{card.title}</div>
            <div className="ai-image-desc">{card.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function ModuloPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string
  const found = findModule(moduleId)

  const [completed, setCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizDone, setQuizDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showXpPopup, setShowXpPopup] = useState(false)

  useEffect(() => {
    async function checkProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('academy_progress')
        .select('completed')
        .eq('user_id', session.user.id)
        .eq('module_id', moduleId)
        .single()
      if (data?.completed) setCompleted(true)
    }
    checkProgress()
  }, [moduleId])

  if (!found) {
    return <div style={{ padding: 40 }}><p>Módulo não encontrado.</p><Link href="/dashboard">Voltar</Link></div>
  }

  const { module, phaseId } = found
  const phase = PHASES.find(p => p.id === phaseId)!

  async function completeModule() {
    if (completed || submitting) return
    setSubmitting(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const quizBonus = quizScore !== null ? quizScore * 25 : 0
    const totalXp = module.xp + quizBonus

    await supabase.from('academy_progress').upsert({
      user_id: session.user.id,
      phase_id: phaseId,
      module_id: moduleId,
      completed: true,
      xp_earned: totalXp,
      completed_at: new Date().toISOString(),
    })

    await supabase.rpc('update_user_xp', { p_user_id: session.user.id, p_xp_to_add: totalXp })

    setXpGained(totalXp)
    setCompleted(true)
    setShowXpPopup(true)
    setSubmitting(false)

    setTimeout(() => {
      setShowXpPopup(false)
      router.push(`/fase/${phaseId}`)
    }, 2500)
  }

  function renderMarkdown(text: string) {
    return text
      .split('\n')
      .map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#E8EEFF">$1</strong>')
        if (line.startsWith('- ') || line.match(/^\d+\./)) {
          return `<li style="margin-bottom:6px;color:#C5CCEE">${bold.replace(/^[-\d+.]+\s/, '')}</li>`
        }
        if (line === '') return '<br/>'
        return `<p style="margin-bottom:10px;color:#C5CCEE">${bold}</p>`
      })
      .join('')
  }

  const typeLabel: Record<string, string> = {
    leitura: 'LEITURA', exercicio: 'EXERCÍCIO', quiz: 'QUIZ', pratica: 'PRÁTICA',
  }
  const typeLabelClass: Record<string, string> = {
    leitura: 'blue', exercicio: 'green', quiz: '', pratica: 'purple',
  }

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* XP Notification — futurista, slide-in direita */}
      {showXpPopup && (
        <div style={{
          position: 'fixed', top: 24, right: 28, zIndex: 1000,
          background: 'rgba(5,5,12,0.97)',
          border: '1px solid rgba(59,91,219,0.3)',
          borderLeft: '3px solid #3B5BDB',
          borderRadius: 10,
          padding: '18px 24px',
          minWidth: 260,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,91,219,0.1)',
          animation: 'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#3B5BDB',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            Módulo Concluído
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 32, fontWeight: 700,
            color: '#E8EEFF', lineHeight: 1,
            marginBottom: 10,
          }}>
            +{xpGained}<span style={{ fontSize: 16, color: '#3B5BDB', marginLeft: 4 }}>XP</span>
          </div>
          {/* Barra de progresso que drena */}
          <div style={{ background: 'rgba(59,91,219,0.15)', borderRadius: 2, height: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: '#3B5BDB',
              animation: 'fill-bar 2.5s linear reverse',
            }} />
          </div>
        </div>
      )}

      {/* Back nav */}
      <Link href={`/fase/${phaseId}`} style={{
        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
        color: '#6B7A9E', fontSize: 13, marginBottom: 32,
        fontFamily: 'Space Grotesk, sans-serif',
        transition: 'color 0.15s',
      }}>
        ← Fase {phaseId}: {phase.title}
      </Link>

      {/* Module header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className={`section-label ${typeLabelClass[module.type]}`}>
            {typeLabel[module.type]}
          </span>
          <span style={{ color: '#6B7A9E', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
            {module.duration}
          </span>
          {completed && (
            <span className="section-label green">COMPLETADO ✓</span>
          )}
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          {module.title}
        </h1>
        <p style={{ color: '#6B7A9E', fontSize: 15, lineHeight: 1.6 }}>{module.subtitle}</p>
      </div>

      {/* Intro — card de destaque com borda lateral */}
      <div style={{
        background: 'rgba(59,91,219,0.07)',
        border: '1px solid rgba(59,91,219,0.18)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: '0 12px 12px 0',
        padding: '20px 26px',
        marginBottom: 32,
        fontSize: 16, lineHeight: 1.8, color: 'var(--text-primary)',
      }}>
        {module.content.intro}
      </div>

      {/* AI Concept Cards */}
      {(module.type === 'leitura' || module.type === 'pratica') && (
        <div style={{ marginBottom: 28 }}>
          <span className="section-label blue" style={{ marginBottom: 14, display: 'inline-flex' }}>CONCEITO VISUAL</span>
          <AIConceptCards phase={phase.title} />
        </div>
      )}

      {/* Sections — cada uma vira um card visual */}
      {module.content.sections.map((section, si) => (
        <div key={si} className="content-section">
          {/* Section header com número */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(59,91,219,0.15)',
              border: '1px solid rgba(59,91,219,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
              color: 'var(--accent-light)',
            }}>
              {String(si + 1).padStart(2, '0')}
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, paddingTop: 4 }}>
              {section.title}
            </h2>
          </div>

          {/* Body */}
          <div
            style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--text-secondary)', paddingLeft: 48 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }}
          />

          {/* Tip */}
          {section.tip && (
            <div className="tip-callout" style={{ marginLeft: 48 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Lightbulb size={14} color="#f59e0b" strokeWidth={1.8} />
              </div>
              <p style={{ color: '#fcd34d', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{section.tip}</p>
            </div>
          )}

          {/* Section prompts */}
          {section.prompts?.map((prompt, pi) => (
            <div key={pi} style={{ marginTop: 24, paddingLeft: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {prompt.label}
              </div>
              {prompt.bad && <TerminalBlock label="PROMPT RUIM">{prompt.bad}</TerminalBlock>}
              <TerminalBlock label={prompt.bad ? 'PROMPT EXCELENTE' : 'PROMPT MODELO'}>{prompt.good}</TerminalBlock>
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', marginTop: 4,
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Por que funciona: </strong>
                  {prompt.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Module-level prompts */}
      {'prompts' in module.content && (module.content as any).prompts?.map((prompt: any, pi: number) => (
        <div key={pi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7A9E', marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>
            {prompt.label}
          </div>
          <TerminalBlock label="PROMPT MODELO">{prompt.good}</TerminalBlock>
          <div style={{
            background: 'rgba(10,10,20,0.7)', border: '1px solid rgba(12,21,102,0.35)',
            borderRadius: 8, padding: '12px 16px', marginTop: 4,
          }}>
            <p style={{ color: '#6B7A9E', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#E8EEFF' }}>Por que funciona: </strong>
              {prompt.explanation}
            </p>
          </div>
        </div>
      ))}

      {/* Exercise */}
      {module.content.exercise && (
        <div style={{
          background: 'rgba(124,58,237,0.06)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 12, padding: '22px', marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span className="section-label purple">EXERCÍCIO PRÁTICO</span>
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: '#C4B5FD', marginBottom: 10 }}>
            {module.content.exercise.title}
          </h3>
          <p style={{ color: '#A78BFA', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
            {module.content.exercise.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {module.content.exercise.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#A78BFA',
                  fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <p style={{ color: '#C4B5FD', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz - new one-at-a-time with neon/shake */}
      {module.content.quiz && !quizDone && (
        <div style={{
          background: 'rgba(10,10,20,0.8)',
          border: '1px solid rgba(12,21,102,0.55)',
          borderRadius: 14, padding: '24px 28px',
          marginBottom: 32,
        }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 4, color: '#E8EEFF' }}>
              Teste seu Conhecimento
            </h2>
            <p style={{ color: '#6B7A9E', fontSize: 13 }}>
              Resolva os cenários abaixo para consolidar o aprendizado.
            </p>
          </div>
          <QuizGame
            questions={module.content.quiz}
            onComplete={(score) => {
              setQuizScore(score)
              setQuizDone(true)
            }}
          />
        </div>
      )}

      {/* Quiz done state */}
      {module.content.quiz && quizDone && quizScore !== null && (
        <div style={{
          background: 'rgba(10,10,20,0.8)',
          border: '1px solid rgba(12,21,102,0.55)',
          borderRadius: 14, padding: '24px 28px',
          marginBottom: 32,
        }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#E8EEFF', marginBottom: 4 }}>
              Teste seu Conhecimento
            </h2>
          </div>
          <div style={{
            background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.2)',
            borderRadius: 12, padding: '24px', textAlign: 'center',
          }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
              {quizScore / module.content.quiz.length >= 0.8
                ? <Trophy size={44} color="#f59e0b" strokeWidth={1.4} />
                : quizScore / module.content.quiz.length >= 0.5
                ? <TrendingUp size={44} color="#3B5BDB" strokeWidth={1.4} />
                : <Target size={44} color="var(--text-secondary)" strokeWidth={1.4} />
              }
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
              {quizScore}/{module.content.quiz.length} corretas
            </div>
            <div style={{ color: '#6B7A9E', fontSize: 13, marginBottom: 16 }}>
              Quiz finalizado — bom trabalho!
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(59,91,219,0.15)', border: '1px solid rgba(59,91,219,0.3)',
              borderRadius: 20, padding: '6px 18px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color: '#93c5fd',
            }}>
              +{quizScore * 25} XP de bônus
            </div>
          </div>
        </div>
      )}

      {/* Complete button */}
      {!completed && (
        <div style={{
          background: 'rgba(10,10,20,0.8)',
          border: '1px solid rgba(59,91,219,0.2)',
          borderRadius: 14, padding: '28px',
          textAlign: 'center', marginTop: 8,
        }}>
          <p style={{ color: '#6B7A9E', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Completou a leitura e os exercícios? Clique para registrar seu progresso.
          </p>
          <button
            onClick={completeModule}
            className="btn-primary"
            disabled={submitting}
            style={{ fontSize: 15, padding: '13px 36px', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Salvando...' : `Completar módulo — +${module.xp}XP`}
          </button>
        </div>
      )}

      {completed && (
        <div style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: 14, padding: '28px 32px',
          marginTop: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CheckCircle2 size={22} color="#10b981" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#10b981', marginBottom: 2 }}>
                Módulo concluído
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Progresso registrado com sucesso
              </div>
            </div>
          </div>
          <Link href={`/fase/${phaseId}`} className="next-level-btn" style={{ flexShrink: 0 }}>
            Continuar
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  )
}
