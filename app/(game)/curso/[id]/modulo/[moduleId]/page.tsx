'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCursoModule, ADMIN_EMAIL_CURSOS } from '@/lib/curso-data'
import { ArrowLeft, CheckCircle2, Lightbulb, Trophy, TrendingUp, Target, Copy, Check, ChevronRight } from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{
      position: 'absolute', top: 10, right: 10,
      background: copied ? 'rgba(5,150,105,0.15)' : 'rgba(59,91,219,0.1)',
      border: `1px solid ${copied ? 'rgba(5,150,105,0.3)' : 'rgba(59,91,219,0.2)'}`,
      borderRadius: 6, padding: '4px 10px',
      color: copied ? '#059669' : '#3B5BDB',
      fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}

function QuizGame({ questions, onComplete }: {
  questions: { question: string; options: string[]; correct: number; explanation: string }[];
  onComplete: (score: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const letters = ['A', 'B', 'C', 'D']

  function handleSelect(oi: number) {
    if (answered) return
    setSelected(oi)
    setAnswered(true)
    if (oi === q.correct) setScore(s => s + 1)
  }

  function handleNext() {
    const next = current + 1
    if (next >= questions.length) {
      setFinished(true)
      onComplete(score + (selected === q.correct ? 0 : 0))
    } else {
      setCurrent(next)
      setSelected(null)
      setAnswered(false)
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div style={{ background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.25)', borderRadius: 12, padding: '28px 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
          {pct >= 80 ? <Trophy size={42} color="#f59e0b" strokeWidth={1.4} />
            : pct >= 50 ? <TrendingUp size={42} color="#3B5BDB" strokeWidth={1.4} />
            : <Target size={42} color="var(--text-secondary)" strokeWidth={1.4} />}
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
          {score}/{questions.length}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {pct >= 80 ? 'Excelente! Voce dominou o conteudo.' : pct >= 50 ? 'Bom trabalho! Continue praticando.' : 'Continue estudando e tente novamente.'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {current + 1}/{questions.length}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {score} corretas
        </span>
      </div>
      <div style={{ background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.15)', borderRadius: 10, padding: '18px 20px', marginBottom: 14 }}>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
          {q.question}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {q.options.map((opt, oi) => {
          const isSelected = selected === oi
          const isCorrect = oi === q.correct
          let bg = 'rgba(107,122,158,0.06)'
          let border = '1px solid rgba(107,122,158,0.15)'
          let color = 'var(--text-secondary)'
          if (answered && isCorrect) { bg = 'rgba(5,150,105,0.1)'; border = '1px solid rgba(5,150,105,0.3)'; color = '#059669' }
          else if (answered && isSelected && !isCorrect) { bg = 'rgba(220,38,38,0.1)'; border = '1px solid rgba(220,38,38,0.3)'; color = '#DC2626' }
          return (
            <button key={oi} onClick={() => handleSelect(oi)} style={{
              background: bg, border, borderRadius: 9, padding: '12px 16px',
              color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13,
              cursor: answered ? 'default' : 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11, opacity: 0.7 }}>{letters[oi]}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <div>
          <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Lightbulb size={14} color="#059669" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{q.explanation}</p>
            </div>
          </div>
          <button onClick={handleNext} style={{
            background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
            border: 'none', borderRadius: 9, padding: '11px 22px',
            color: '#fff', fontWeight: 700, fontSize: 13,
            fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {current + 1 >= questions.length ? 'Ver resultado' : 'Proxima pergunta'}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

function renderBody(body: string) {
  return body.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <br key={i} />
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      return <p key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', margin: '10px 0 4px 0' }}>{trimmed.slice(2, -2)}</p>
    }
    const parts = trimmed.split(/(\*\*.*?\*\*)/)
    return (
      <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '4px 0' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function CursoModuloPage() {
  const params = useParams()
  const router = useRouter()
  const cursoId = params.id as string
  const moduleId = params.moduleId as string

  const result = getCursoModule(cursoId, moduleId)
  const [isAdmin, setIsAdmin] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      if (session.user.email === ADMIN_EMAIL_CURSOS) setIsAdmin(true)
      const { data } = await supabase
        .from('academy_progress')
        .select('completed')
        .eq('user_id', session.user.id)
        .eq('module_id', moduleId)
        .single()
      if (data?.completed) setCompleted(true)
      setLoading(false)
    }
    load()
  }, [moduleId])

  if (!result) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>Modulo nao encontrado</h1>
        <Link href="/especializacoes" style={{ color: '#3B5BDB' }}>Voltar</Link>
      </div>
    )
  }

  const { module: mod, fase } = result

  async function handleComplete() {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setSaving(false); return }
    await supabase.from('academy_progress').upsert({
      user_id: session.user.id,
      module_id: moduleId,
      phase_id: fase.id,
      completed: true,
      xp_earned: mod.xp,
    }, { onConflict: 'user_id,module_id' })
    await supabase.from('academy_profiles').update({ xp: supabase.rpc('increment_xp', { amount: mod.xp }) }).eq('id', session.user.id)
    setCompleted(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const { content } = mod

  return (
    <div style={{ padding: '36px 48px' }}>

      {/* Back */}
      <Link href={`/curso/${cursoId}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
        <ArrowLeft size={15} strokeWidth={2} />
        {fase.title}
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className="section-label" style={{ color: '#3B5BDB', borderColor: 'rgba(59,91,219,0.25)', background: 'rgba(59,91,219,0.08)', fontSize: 9 }}>
            {mod.type.toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{mod.duration}</span>
          <span style={{ fontSize: 11, color: '#E85D04', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>+{mod.xp} XP</span>
          {completed && (
            <span className="section-label green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={9} />
              CONCLUIDO
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.2 }}>
          {mod.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>{mod.subtitle}</p>
      </div>

      {/* Intro */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 28, borderLeft: '3px solid #3B5BDB' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{content.intro}</p>
      </div>

      {/* Sections */}
      {content.sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            {section.title}
          </h2>
          <div style={{ position: 'relative' }}>
            {section.body.includes('*"') && <CopyButton text={section.body.replace(/\*\*/g, '').replace(/\*"([^"]+)"/g, '$1')} />}
            <div style={{ lineHeight: 1.8 }}>
              {renderBody(section.body)}
            </div>
          </div>
          {section.tip && (
            <div style={{
              background: 'rgba(232,93,4,0.06)', border: '1px solid rgba(232,93,4,0.2)',
              borderRadius: 9, padding: '12px 16px', marginTop: 14,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Lightbulb size={14} color="#E85D04" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{section.tip}</p>
            </div>
          )}
        </div>
      ))}

      {/* Exercise */}
      {content.exercise && (
        <div style={{ marginBottom: 28 }}>
          <div className="glass-card" style={{ padding: '22px 26px', borderLeft: '3px solid #059669' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="section-label" style={{ color: '#059669', borderColor: 'rgba(5,150,105,0.25)', background: 'rgba(5,150,105,0.08)' }}>
                EXERCICIO PRATICO
              </span>
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              {content.exercise.title}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              {content.exercise.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {content.exercise.steps.map((step, si) => (
                <div key={si} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, flexShrink: 0, borderRadius: 6,
                    background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: '#059669', fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    {si + 1}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {content.quiz && content.quiz.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
            Quiz — Teste seus conhecimentos
          </h2>
          <QuizGame
            questions={content.quiz}
            onComplete={(score) => {
              setQuizDone(true)
            }}
          />
        </div>
      )}

      {/* Complete button */}
      <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 32 }}>
        {completed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669' }}>
              <CheckCircle2 size={20} strokeWidth={1.8} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15 }}>
                Modulo concluido! +{mod.xp} XP ganhos
              </span>
            </div>
            <Link href={`/curso/${cursoId}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
              <button style={{
                background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.25)',
                borderRadius: 9, padding: '10px 18px',
                color: '#3B5BDB', fontWeight: 700, fontSize: 13,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                Proximo modulo
                <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
              border: 'none', borderRadius: 10, padding: '14px 28px',
              color: '#fff', fontWeight: 700, fontSize: 15,
              fontFamily: 'Space Grotesk, sans-serif', cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1,
            }}
          >
            <CheckCircle2 size={16} strokeWidth={2} />
            {saving ? 'Salvando...' : 'Marcar como concluido'}
          </button>
        )}
      </div>
    </div>
  )
}
