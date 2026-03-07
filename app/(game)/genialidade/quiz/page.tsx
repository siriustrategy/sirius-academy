'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QUIZ_SECTIONS, getSectionProgress, TOTAL_QUESTIONS } from '@/lib/genius-quiz-data'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

type Answers = Record<string, string | string[]>

export default function GeniusQuizPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== ADMIN_EMAIL) { setAccessDenied(true); return }
      setUserId(session.user.id)
    }
    check()
  }, [router])

  const section = QUIZ_SECTIONS[sectionIdx]
  const question = section?.questions[questionIdx]
  const progress = getSectionProgress(sectionIdx, questionIdx)
  const answer = answers[question?.id ?? '']
  const isFirst = sectionIdx === 0 && questionIdx === 0
  const isLast = sectionIdx === QUIZ_SECTIONS.length - 1 && questionIdx === section.questions.length - 1

  const hasAnswer = answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true)

  function setAnswer(value: string | string[]) {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  function toggleMulti(opt: string) {
    const cur = (answer as string[] | undefined) ?? []
    if (cur.includes(opt)) {
      setAnswer(cur.filter(v => v !== opt))
    } else if (cur.length < (question.maxSelect ?? 3)) {
      setAnswer([...cur, opt])
    }
  }

  const navigate = useCallback((dir: 'next' | 'back') => {
    setAnimating(true)
    setTimeout(() => {
      if (dir === 'next') {
        if (questionIdx < section.questions.length - 1) {
          setQuestionIdx(q => q + 1)
        } else if (sectionIdx < QUIZ_SECTIONS.length - 1) {
          setSectionIdx(s => s + 1)
          setQuestionIdx(0)
        }
      } else {
        if (questionIdx > 0) {
          setQuestionIdx(q => q - 1)
        } else if (sectionIdx > 0) {
          setSectionIdx(s => s - 1)
          setQuestionIdx(QUIZ_SECTIONS[sectionIdx - 1].questions.length - 1)
        }
      }
      setAnimating(false)
    }, 180)
  }, [section, sectionIdx, questionIdx])

  async function handleSubmit() {
    if (!userId) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('genius_assessments').upsert({
        user_id: userId,
        answers: answers,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

      if (error) throw error

      // Call analysis API
      const res = await fetch('/api/genius-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, userId }),
      })

      if (!res.ok) throw new Error('Erro na análise')
      router.push('/genialidade/resultado')
    } catch (e) {
      console.error(e)
      alert('Erro ao salvar. Tente novamente.')
      setSubmitting(false)
    }
  }

  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Acesso restrito</div>
        <div style={{ color: 'var(--text-secondary)' }}>Esta funcionalidade ainda não está disponível para todos os usuários.</div>
        <button onClick={() => router.push('/genialidade')} style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
          Voltar
        </button>
      </div>
    )
  }

  if (!userId || !question) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const color = section.color
  const colorLight = section.colorLight

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .quiz-fade { animation: fadeUp 0.3s ease; }
        .opt-btn { transition: all 0.15s ease; }
        .opt-btn:hover { transform: translateX(4px); }
        .scale-btn { transition: all 0.15s ease; }
        .scale-btn:hover { transform: scale(1.08); }
      `}</style>

      {/* Top progress bar */}
      <div style={{ height: 4, background: 'var(--border)', position: 'fixed', top: 0, left: 220, right: 0, zIndex: 100 }}>
        <div style={{
          height: '100%', background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          width: `${progress.percent}%`, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 40px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Section badge */}
          <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: colorLight, border: `1px solid ${color}35`,
              borderRadius: 20, padding: '6px 14px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
                {section.subtitle.toUpperCase()} — {section.title.toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              {progress.current}/{progress.total}
            </span>
          </div>

          {/* Question card */}
          <div
            key={`${sectionIdx}-${questionIdx}`}
            className="quiz-fade"
            style={{
              background: 'rgba(8,12,24,0.7)',
              border: `1px solid ${color}25`,
              borderRadius: 16, padding: '36px 40px',
              backdropFilter: 'blur(12px)',
              boxShadow: `0 0 40px ${color}10`,
            }}
          >
            {/* Section context */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', marginBottom: 12 }}>
              Seção {sectionIdx + 1} de {QUIZ_SECTIONS.length} — Pergunta {questionIdx + 1} de {section.questions.length}
            </div>

            {/* Question text */}
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22, fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.45, marginBottom: 28,
            }}>
              {question.text}
            </h2>

            {/* Scale input */}
            {question.type === 'scale' && (
              <div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      className="scale-btn"
                      onClick={() => setAnswer(String(v))}
                      style={{
                        width: 52, height: 52, borderRadius: 12, border: `2px solid ${answer === String(v) ? color : 'var(--border)'}`,
                        background: answer === String(v) ? colorLight : 'var(--muted-bg)',
                        color: answer === String(v) ? color : 'var(--text-secondary)',
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {question.scaleLabels && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{question.scaleLabels[0]}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{question.scaleLabels[1]}</span>
                  </div>
                )}
              </div>
            )}

            {/* Choice input */}
            {question.type === 'choice' && question.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {question.options.map((opt, i) => {
                  const selected = answer === opt
                  return (
                    <button
                      key={i}
                      className="opt-btn"
                      onClick={() => setAnswer(opt)}
                      style={{
                        background: selected ? colorLight : 'var(--muted-bg)',
                        border: `1px solid ${selected ? color : 'var(--border)'}`,
                        borderRadius: 10, padding: '12px 16px',
                        color: selected ? color : 'var(--text-secondary)',
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: selected ? 700 : 500, fontSize: 14,
                        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${selected ? color : 'var(--border)'}`,
                        background: selected ? color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selected && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Multi input */}
            {question.type === 'multi' && question.options && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                  Selecione até {question.maxSelect ?? 3} opções
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {question.options.map((opt, i) => {
                    const cur = (answer as string[] | undefined) ?? []
                    const selected = cur.includes(opt)
                    const disabled = !selected && cur.length >= (question.maxSelect ?? 3)
                    return (
                      <button
                        key={i}
                        className="opt-btn"
                        onClick={() => toggleMulti(opt)}
                        disabled={disabled}
                        style={{
                          background: selected ? colorLight : 'var(--muted-bg)',
                          border: `1px solid ${selected ? color : 'var(--border)'}`,
                          borderRadius: 10, padding: '12px 16px',
                          color: selected ? color : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: selected ? 700 : 500, fontSize: 14,
                          cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1,
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                          border: `2px solid ${selected ? color : 'var(--border)'}`,
                          background: selected ? color : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {selected && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Text input */}
            {question.type === 'text' && (
              <textarea
                value={(answer as string) ?? ''}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                rows={3}
                style={{
                  width: '100%', background: 'var(--muted-bg)',
                  border: `1px solid ${answer ? color + '60' : 'var(--border)'}`,
                  borderRadius: 10, padding: '14px 16px',
                  color: 'var(--text-primary)', fontSize: 15, fontFamily: 'Space Grotesk, sans-serif',
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = `${color}80`}
                onBlur={e => e.target.style.borderColor = answer ? `${color}60` : 'var(--border)'}
              />
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate('back')}
              disabled={isFirst}
              style={{
                background: 'var(--muted-bg)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 20px',
                color: 'var(--text-secondary)', cursor: isFirst ? 'not-allowed' : 'pointer',
                opacity: isFirst ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14,
              }}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer || submitting}
                style={{
                  background: hasAnswer && !submitting ? `linear-gradient(135deg, #7C3AED, #DB2777)` : 'var(--muted-bg)',
                  border: 'none', borderRadius: 10, padding: '12px 28px',
                  color: hasAnswer && !submitting ? '#fff' : 'var(--text-muted)',
                  cursor: hasAnswer && !submitting ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                {submitting ? 'Gerando seu Blueprint...' : 'Ver meu Blueprint'}
                {!submitting && <ChevronRight size={16} />}
              </button>
            ) : (
              <button
                onClick={() => navigate('next')}
                disabled={!hasAnswer}
                style={{
                  background: hasAnswer ? color : 'var(--muted-bg)',
                  border: 'none', borderRadius: 10, padding: '12px 24px',
                  color: hasAnswer ? '#fff' : 'var(--text-muted)',
                  cursor: hasAnswer ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                Próxima
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Skip text answer hint */}
          {question.type === 'text' && !hasAnswer && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button
                onClick={() => { setAnswer(' '); navigate('next') }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Pular esta pergunta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 24 }}>
        {QUIZ_SECTIONS.map((s, i) => (
          <div key={i} style={{
            width: i === sectionIdx ? 24 : 8, height: 8, borderRadius: 4,
            background: i < sectionIdx ? s.color : i === sectionIdx ? s.color : 'var(--border)',
            transition: 'all 0.3s ease', opacity: i === sectionIdx ? 1 : i < sectionIdx ? 0.6 : 0.3,
          }} />
        ))}
      </div>
    </div>
  )
}
