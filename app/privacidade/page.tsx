'use client'

import Link from 'next/link'

function SiriusLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
      <defs>
        <filter id="pg1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="pg2" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="19" y1="8" x2="28" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8" x2="10" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <circle cx="10" cy="17" r="1.3" fill="#7B9FFF" filter="url(#pg1)" />
      <circle cx="28" cy="17" r="1.3" fill="#7B9FFF" filter="url(#pg1)" />
      <circle cx="14" cy="27" r="1.1" fill="#5C7FFF" filter="url(#pg1)" />
      <circle cx="24" cy="27" r="1.1" fill="#5C7FFF" filter="url(#pg1)" />
      <circle cx="19" cy="8" r="3.2" fill="#3B5BDB" filter="url(#pg2)" />
      <circle cx="19" cy="8" r="1.6" fill="#E8EEFF" />
    </svg>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 18, fontWeight: 700,
        color: '#E8EEFF', marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid rgba(59,91,219,0.15)',
      }}>
        {title}
      </h2>
      <div style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: 12 }}>{children}</p>
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B5BDB', flexShrink: 0, marginTop: 7 }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DataTable({ rows }: { rows: { dado: string; finalidade: string; base: string }[] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'rgba(59,91,219,0.1)' }}>
            {['Dado coletado', 'Finalidade', 'Base legal (LGPD)'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                color: '#7B9FFF', fontSize: 11, letterSpacing: '0.06em',
                borderBottom: '1px solid rgba(59,91,219,0.2)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '10px 14px', color: '#C5CCEE', fontWeight: 600 }}>{row.dado}</td>
              <td style={{ padding: '10px 14px', color: '#8B9CC8' }}>{row.finalidade}</td>
              <td style={{ padding: '10px 14px', color: '#6B7A9E', fontStyle: 'italic' }}>{row.base}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PrivacidadePage() {
  const lastUpdated = '07 de março de 2026'

  return (
    <div style={{ minHeight: '100vh', background: '#080C18', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,7,16,0.9)',
        borderBottom: '1px solid rgba(59,91,219,0.12)',
        backdropFilter: 'blur(16px)',
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <SiriusLogo />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: '#E8EEFF', letterSpacing: '0.06em', lineHeight: 1.1 }}>SIRIUS</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 9, color: '#6B7A9E', letterSpacing: '0.16em' }}>ACADEMY</div>
          </div>
        </Link>
        <Link href="/termos" style={{ textDecoration: 'none', color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>
          Termos de Uso
        </Link>
      </nav>

      {/* Conteúdo */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '104px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.2)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 20,
          }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#7B9FFF', letterSpacing: '0.12em' }}>
              DOCUMENTO LEGAL — LGPD
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
            color: '#E8EEFF', marginBottom: 12, letterSpacing: '-0.02em',
          }}>
            Política de Privacidade
          </h1>
          <p style={{ color: '#6B7A9E', fontSize: 14 }}>
            Última atualização: {lastUpdated}
          </p>
        </div>

        <div style={{
          background: 'rgba(59,91,219,0.06)',
          border: '1px solid rgba(59,91,219,0.2)',
          borderRadius: 12, padding: '18px 22px',
          marginBottom: 40,
        }}>
          <p style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Esta Política de Privacidade descreve como a <strong style={{ color: '#C5CCEE' }}>Sirius Strategy</strong>, operadora da plataforma <strong style={{ color: '#C5CCEE' }}>Sirius Academy</strong>, coleta, utiliza, armazena e protege os dados pessoais dos usuários, em conformidade com a <strong style={{ color: '#C5CCEE' }}>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong> e demais legislações aplicáveis.
          </p>
        </div>

        <Section title="1. Controlador dos Dados">
          <P>O controlador dos dados pessoais tratados por meio da plataforma Sirius Academy é:</P>
          <div style={{
            background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.15)',
            borderRadius: 10, padding: '16px 20px', marginTop: 8,
          }}>
            <div style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 2 }}>
              <div><strong>Razão social:</strong> Sirius Strategy</div>
              <div><strong>E-mail do Encarregado (DPO):</strong> siriustrategy@gmail.com</div>
              <div><strong>Plataforma:</strong> https://sirius-academy-production.up.railway.app</div>
            </div>
          </div>
        </Section>

        <Section title="2. Dados Coletados e Finalidades">
          <P>Coletamos apenas os dados estritamente necessários para a prestação dos nossos serviços. Abaixo, detalhamos cada categoria de dado, sua finalidade e a base legal que autoriza o tratamento:</P>

          <DataTable rows={[
            { dado: 'Nome e e-mail', finalidade: 'Criação e gerenciamento da conta de usuário', base: 'Execução de contrato (Art. 7º, V)' },
            { dado: 'Senha (hash criptografado)', finalidade: 'Autenticação segura na plataforma', base: 'Execução de contrato (Art. 7º, V)' },
            { dado: 'Nome de exibição e avatar', finalidade: 'Personalização do perfil e experiência gamificada', base: 'Consentimento (Art. 7º, I)' },
            { dado: 'Progresso nos módulos e XP', finalidade: 'Funcionamento do sistema de gamificação e trilhas', base: 'Execução de contrato (Art. 7º, V)' },
            { dado: 'Respostas do Mapeamento de Genialidade', finalidade: 'Geração do relatório personalizado com IA', base: 'Consentimento (Art. 7º, I)' },
            { dado: 'CPF, telefone e CEP', finalidade: 'Processamento de pagamentos via Asaas', base: 'Execução de contrato (Art. 7º, V)' },
            { dado: 'Histórico de compras', finalidade: 'Controle de acesso a conteúdos pagos e suporte', base: 'Obrigação legal (Art. 7º, II)' },
            { dado: 'Dados de acesso (IP, navegador, horário)', finalidade: 'Segurança, prevenção a fraudes e melhoria da plataforma', base: 'Legítimo interesse (Art. 7º, IX)' },
          ]} />

          <P>Não coletamos dados sensíveis (saúde, biometria, dados de crianças) nem dados desnecessários para a prestação dos nossos serviços.</P>
        </Section>

        <Section title="3. Uso de Inteligência Artificial">
          <P>A funcionalidade de Mapeamento de Zona de Genialidade utiliza a <strong style={{ color: '#C5CCEE' }}>API da Anthropic (Claude)</strong> para gerar análises personalizadas com base nas respostas fornecidas pelo usuário no questionário. As respostas são enviadas de forma segura para geração do relatório e não são utilizadas para treinar modelos de IA pela Sirius Academy.</P>
          <P>O usuário é informado antes de iniciar o mapeamento e consente expressamente com o envio de suas respostas para fins de geração do relatório. Os dados são tratados de acordo com a <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#7B9FFF', textDecoration: 'none' }}>Política de Privacidade da Anthropic</a>.</P>
        </Section>

        <Section title="4. Compartilhamento de Dados com Terceiros">
          <P>A Sirius Academy não vende, aluga ou compartilha dados pessoais dos usuários com terceiros para fins comerciais. O compartilhamento ocorre apenas nas seguintes situações e com os seguintes parceiros:</P>
          <Ul items={[
            'Supabase (infraestrutura de banco de dados e autenticação) — os dados são armazenados em servidores seguros com criptografia em repouso e em trânsito;',
            'Asaas (processamento de pagamentos) — recebe apenas os dados necessários para processar transações financeiras, conforme sua própria política de privacidade;',
            'Anthropic (geração de relatórios com IA) — recebe as respostas do questionário de mapeamento para fins exclusivos de geração do relatório solicitado pelo usuário;',
            'Railway (infraestrutura de hospedagem) — hospeda a aplicação sem acesso ao conteúdo dos dados dos usuários;',
            'Autoridades competentes — em caso de obrigação legal, decisão judicial ou requisição de autoridade pública competente.',
          ]} />
          <P>Todos os fornecedores listados acima são suboperadores de dados que atuam sob contratos com cláusulas de proteção de dados adequadas.</P>
        </Section>

        <Section title="5. Armazenamento e Segurança dos Dados">
          <P><strong style={{ color: '#C5CCEE' }}>5.1 Local de armazenamento.</strong> Os dados são armazenados em servidores do Supabase, localizados nos Estados Unidos, com conformidade ao GDPR europeu e práticas de segurança equivalentes à LGPD brasileira.</P>
          <P><strong style={{ color: '#C5CCEE' }}>5.2 Medidas de segurança.</strong> Adotamos as seguintes medidas técnicas e organizacionais para proteger seus dados:</P>
          <Ul items={[
            'Criptografia de senhas com algoritmo bcrypt (nunca armazenamos senhas em texto puro);',
            'Tráfego de dados protegido por HTTPS/TLS em toda a plataforma;',
            'Isolamento de dados por usuário com políticas de Row Level Security (RLS) no banco de dados;',
            'Acesso administrativo restrito e controlado por autenticação de dois fatores;',
            'Chaves de API e credenciais armazenadas em variáveis de ambiente, nunca expostas no código.',
          ]} />
          <P><strong style={{ color: '#C5CCEE' }}>5.3 Prazo de retenção.</strong> Os dados pessoais são mantidos enquanto a conta do usuário estiver ativa. Após o encerramento da conta, os dados são removidos em até 90 (noventa) dias, exceto aqueles cuja retenção seja exigida por obrigação legal (como dados fiscais, mantidos por 5 anos conforme legislação tributária).</P>
        </Section>

        <Section title="6. Direitos do Titular dos Dados (LGPD — Art. 18)">
          <P>Em conformidade com a LGPD, você, como titular dos dados, possui os seguintes direitos, que podem ser exercidos a qualquer momento mediante solicitação ao nosso canal de atendimento:</P>
          <Ul items={[
            'Confirmação: saber se tratamos algum dado pessoal seu;',
            'Acesso: obter cópia dos dados pessoais que mantemos sobre você;',
            'Correção: solicitar a atualização ou correção de dados incompletos, inexatos ou desatualizados;',
            'Anonimização, bloqueio ou eliminação: de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD;',
            'Portabilidade: receber seus dados em formato estruturado e interoperável;',
            'Eliminação: solicitar a exclusão de dados pessoais tratados com base no consentimento;',
            'Informação sobre compartilhamento: saber com quais entidades compartilhamos seus dados;',
            'Revogação do consentimento: retirar o consentimento dado para tratamentos baseados nessa base legal;',
            'Oposição: opor-se a tratamentos realizados com base em legítimo interesse.',
          ]} />
          <P>Para exercer qualquer um desses direitos, envie uma solicitação para <strong style={{ color: '#C5CCEE' }}>siriustrategy@gmail.com</strong> com o assunto "LGPD — Direitos do Titular". Responderemos em até 15 (quinze) dias úteis.</P>
        </Section>

        <Section title="7. Cookies e Tecnologias de Rastreamento">
          <P>A Sirius Academy utiliza cookies e tecnologias similares para:</P>
          <Ul items={[
            'Manter a sessão do usuário autenticada (cookies de sessão — estritamente necessários);',
            'Lembrar preferências de uso da plataforma (cookies funcionais);',
            'Analisar padrões de uso para melhoria da experiência (dados anonimizados).',
          ]} />
          <P>Não utilizamos cookies de rastreamento para fins publicitários nem compartilhamos dados de navegação com redes de anúncios. Você pode gerenciar as configurações de cookies do seu navegador a qualquer momento, mas a desativação de cookies essenciais pode comprometer o funcionamento da plataforma.</P>
        </Section>

        <Section title="8. Menores de Idade">
          <P>A Sirius Academy não é destinada a pessoas com menos de 18 (dezoito) anos. Não coletamos intencionalmente dados pessoais de menores. Caso identifiquemos que dados de um menor foram coletados sem o consentimento dos responsáveis, procederemos com a exclusão imediata dessas informações. Se você acredita que coletamos dados de um menor, entre em contato imediatamente pelo nosso e-mail de suporte.</P>
        </Section>

        <Section title="9. Transferência Internacional de Dados">
          <P>Em razão da utilização de serviços de infraestrutura baseados nos Estados Unidos (Supabase, Railway, Anthropic), alguns dados pessoais podem ser transferidos para fora do Brasil. Estas transferências ocorrem com garantias adequadas de proteção, incluindo cláusulas contratuais padrão e conformidade com regulamentações internacionais de proteção de dados (GDPR), em nível de proteção compatível com o exigido pela LGPD, conforme art. 33 da Lei nº 13.709/2018.</P>
        </Section>

        <Section title="10. Incidentes de Segurança">
          <P>Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a Sirius Strategy notificará a Autoridade Nacional de Proteção de Dados (ANPD) e os usuários afetados no prazo de 72 (setenta e duas) horas após a ciência do ocorrido, conforme exigido pela LGPD, informando a natureza dos dados afetados, as medidas adotadas e as recomendações para os titulares.</P>
        </Section>

        <Section title="11. Alterações nesta Política">
          <P>Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nos nossos serviços, na legislação aplicável ou em nossas práticas de privacidade. Alterações relevantes serão comunicadas aos usuários por e-mail com antecedência mínima de 10 (dez) dias. A versão vigente estará sempre disponível nesta página, com a data da última atualização indicada no topo do documento.</P>
        </Section>

        <Section title="12. Contato e Canal de Atendimento">
          <P>Para exercer seus direitos, tirar dúvidas ou registrar reclamações sobre o tratamento dos seus dados pessoais, utilize nosso canal oficial:</P>
          <div style={{
            background: 'rgba(59,91,219,0.06)',
            border: '1px solid rgba(59,91,219,0.15)',
            borderRadius: 10, padding: '18px 22px', marginTop: 8,
          }}>
            <div style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 2 }}>
              <div><strong>Encarregado de Dados (DPO):</strong> Equipe Sirius Strategy</div>
              <div><strong>E-mail:</strong> siriustrategy@gmail.com</div>
              <div><strong>Assunto:</strong> LGPD — Direitos do Titular</div>
              <div><strong>Prazo de resposta:</strong> até 15 dias úteis</div>
            </div>
          </div>
          <P style={{ marginTop: 14 } as React.CSSProperties}>
            Você também pode registrar reclamações junto à <strong style={{ color: '#C5CCEE' }}>Autoridade Nacional de Proteção de Dados (ANPD)</strong>, acessível em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" style={{ color: '#7B9FFF', textDecoration: 'none' }}>www.gov.br/anpd</a>.
          </P>
        </Section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(59,91,219,0.1)',
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#6B7A9E' }}>
          Sirius Academy — Sirius Strategy
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/termos" style={{ fontSize: 12, color: '#4A5270', textDecoration: 'none' }}>Termos de Uso</Link>
          <Link href="/privacidade" style={{ fontSize: 12, color: '#3B5BDB', textDecoration: 'none', fontWeight: 600 }}>Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  )
}
