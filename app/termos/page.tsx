'use client'

import Link from 'next/link'

function SiriusLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
      <defs>
        <filter id="tg1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tg2" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="19" y1="8" x2="28" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8" x2="10" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <circle cx="10" cy="17" r="1.3" fill="#7B9FFF" filter="url(#tg1)" />
      <circle cx="28" cy="17" r="1.3" fill="#7B9FFF" filter="url(#tg1)" />
      <circle cx="14" cy="27" r="1.1" fill="#5C7FFF" filter="url(#tg1)" />
      <circle cx="24" cy="27" r="1.1" fill="#5C7FFF" filter="url(#tg1)" />
      <circle cx="19" cy="8" r="3.2" fill="#3B5BDB" filter="url(#tg2)" />
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

export default function TermosPage() {
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
        <Link href="/privacidade" style={{ textDecoration: 'none', color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>
          Política de Privacidade
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
              DOCUMENTO LEGAL
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
            color: '#E8EEFF', marginBottom: 12, letterSpacing: '-0.02em',
          }}>
            Termos de Uso
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
            Estes Termos de Uso regulam o acesso e a utilização da plataforma <strong style={{ color: '#C5CCEE' }}>Sirius Academy</strong>, operada pela <strong style={{ color: '#C5CCEE' }}>Sirius Strategy</strong>. Ao criar uma conta ou utilizar qualquer funcionalidade da plataforma, você declara ter lido, compreendido e concordado integralmente com estes termos. Caso não concorde com alguma disposição, recomendamos que não utilize nossos serviços.
          </p>
        </div>

        <Section title="1. Identificação do Prestador de Serviço">
          <P>A plataforma Sirius Academy é operada pela <strong style={{ color: '#C5CCEE' }}>Sirius Strategy</strong>, empresa com sede no Brasil, acessível pelo endereço eletrônico <strong style={{ color: '#C5CCEE' }}>https://sirius-academy-production.up.railway.app</strong>.</P>
          <P>Para entrar em contato com nossa equipe, utilize o e-mail: <strong style={{ color: '#C5CCEE' }}>siriustrategy@gmail.com</strong></P>
        </Section>

        <Section title="2. Descrição dos Serviços">
          <P>A Sirius Academy é uma plataforma de aprendizado em formato digital que oferece:</P>
          <Ul items={[
            'Módulos de educação sobre ferramentas e aplicações de Inteligência Artificial para uso profissional;',
            'Trilhas de aprendizado organizadas por área de atuação e nível de conhecimento;',
            'Sistema de gamificação com pontos de experiência (XP) e progressão de níveis;',
            'Ferramenta de Mapeamento de Zona de Genialidade, baseada em metodologias de desenvolvimento humano;',
            'Conteúdos em formato de leitura, exercícios práticos, quizzes e atividades de aplicação.',
          ]} />
          <P>Os serviços são prestados exclusivamente em ambiente digital, sem qualquer componente presencial, aulas ao vivo obrigatórias ou garantia de resultado específico ao usuário.</P>
        </Section>

        <Section title="3. Cadastro e Conta de Usuário">
          <P><strong style={{ color: '#C5CCEE' }}>3.1 Elegibilidade.</strong> Para criar uma conta na Sirius Academy, o usuário deve ter pelo menos 18 (dezoito) anos de idade ou a maioridade legal em sua jurisdição. Menores de 18 anos somente poderão utilizar a plataforma com consentimento expresso de seus responsáveis legais.</P>
          <P><strong style={{ color: '#C5CCEE' }}>3.2 Veracidade das informações.</strong> O usuário é integralmente responsável pela veracidade e atualidade das informações fornecidas no cadastro. A Sirius Academy se reserva o direito de suspender ou encerrar contas com informações falsas, incompletas ou desatualizadas.</P>
          <P><strong style={{ color: '#C5CCEE' }}>3.3 Segurança da conta.</strong> O usuário é responsável pela confidencialidade de suas credenciais de acesso. Qualquer atividade realizada com sua conta será de sua responsabilidade. Em caso de suspeita de acesso não autorizado, o usuário deve notificar imediatamente a Sirius Academy pelo canal de suporte.</P>
          <P><strong style={{ color: '#C5CCEE' }}>3.4 Unicidade.</strong> É vedada a criação de múltiplas contas por um mesmo usuário para fins de burlar limitações de acesso ou políticas da plataforma.</P>
        </Section>

        <Section title="4. Acesso ao Conteúdo e Pagamentos">
          <P><strong style={{ color: '#C5CCEE' }}>4.1 Conteúdo gratuito.</strong> A Sirius Academy oferece acesso gratuito a módulos selecionados de cada trilha. O usuário pode criar uma conta sem necessidade de pagamento e acessar o conteúdo disponibilizado sem custo.</P>
          <P><strong style={{ color: '#C5CCEE' }}>4.2 Conteúdo pago.</strong> Determinadas funcionalidades, como o Mapeamento de Zona de Genialidade, possuem cobrança avulsa no valor de <strong style={{ color: '#C5CCEE' }}>R$ 12,90 (doze reais e noventa centavos)</strong>. O acesso a esses recursos é concedido somente após a confirmação do pagamento pelo sistema de processamento adotado.</P>
          <P><strong style={{ color: '#C5CCEE' }}>4.3 Processamento de pagamentos.</strong> Os pagamentos são processados pela plataforma <strong style={{ color: '#C5CCEE' }}>Asaas</strong>, sujeita aos seus próprios termos e condições. A Sirius Academy não armazena dados de cartão de crédito ou informações bancárias do usuário.</P>
          <P><strong style={{ color: '#C5CCEE' }}>4.4 Política de reembolso.</strong> Em consonância com o artigo 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), o usuário que adquirir acesso a conteúdo pago poderá solicitar o cancelamento e reembolso integral no prazo de até <strong style={{ color: '#C5CCEE' }}>7 (sete) dias corridos</strong> a partir da data da compra, desde que não tenha acessado mais de 30% (trinta por cento) do conteúdo adquirido. Solicitações fora desse prazo serão analisadas caso a caso.</P>
          <P><strong style={{ color: '#C5CCEE' }}>4.5 Alteração de preços.</strong> A Sirius Academy reserva-se o direito de alterar os preços dos conteúdos pagos a qualquer momento, sem aviso prévio. Alterações de preço não afetam acessos já adquiridos.</P>
        </Section>

        <Section title="5. Uso Aceitável da Plataforma">
          <P>O usuário concorda em utilizar a Sirius Academy exclusivamente para fins lícitos e de acordo com estes Termos. São expressamente proibidas as seguintes condutas:</P>
          <Ul items={[
            'Compartilhar credenciais de acesso com terceiros ou permitir que outras pessoas utilizem sua conta;',
            'Reproduzir, distribuir, modificar, sublicenciar ou criar obras derivadas de qualquer conteúdo da plataforma sem autorização prévia e expressa;',
            'Utilizar sistemas automatizados (bots, scrapers, crawlers) para acessar, extrair ou indexar o conteúdo da plataforma;',
            'Tentar acessar áreas restritas, sistemas ou dados da plataforma sem autorização;',
            'Praticar qualquer conduta que possa prejudicar, sobrecarregar ou comprometer o funcionamento da plataforma;',
            'Utilizar a plataforma para fins fraudulentos, ilegais ou que violem direitos de terceiros;',
            'Publicar, transmitir ou compartilhar conteúdo ofensivo, difamatório, discriminatório ou que viole a legislação brasileira.',
          ]} />
          <P>O descumprimento destas regras poderá resultar na suspensão ou encerramento imediato da conta, sem direito a reembolso, e poderá acarretar responsabilidade civil e/ou criminal conforme a legislação aplicável.</P>
        </Section>

        <Section title="6. Propriedade Intelectual">
          <P><strong style={{ color: '#C5CCEE' }}>6.1 Conteúdo da plataforma.</strong> Todo o conteúdo disponibilizado na Sirius Academy — incluindo, mas não se limitando a textos, módulos educacionais, metodologias, prompts, exercícios, imagens, logotipos, marcas e software — é de propriedade exclusiva da Sirius Strategy ou de seus licenciadores, protegido pela legislação brasileira e internacional de propriedade intelectual.</P>
          <P><strong style={{ color: '#C5CCEE' }}>6.2 Licença de uso.</strong> O acesso à plataforma concede ao usuário uma licença pessoal, intransferível, não exclusiva e revogável para utilizar o conteúdo exclusivamente para fins de aprendizado individual. Esta licença não autoriza qualquer forma de reprodução, distribuição ou uso comercial.</P>
          <P><strong style={{ color: '#C5CCEE' }}>6.3 Conteúdo gerado pelo usuário.</strong> Ao submeter qualquer conteúdo à plataforma (respostas de quizzes, exercícios, feedbacks), o usuário concede à Sirius Strategy uma licença gratuita, irrevogável e não exclusiva para utilizar tais dados de forma anonimizada para fins de melhoria dos serviços.</P>
        </Section>

        <Section title="7. Disponibilidade e Modificações do Serviço">
          <P>A Sirius Academy empenha-se em manter a plataforma disponível de forma contínua, mas não garante disponibilidade ininterrupta. Manutenções programadas ou emergenciais, falhas de infraestrutura de terceiros e eventos de força maior podem causar indisponibilidades temporárias, sem que isso gere qualquer responsabilidade ou obrigação de indenização.</P>
          <P>A Sirius Strategy reserva-se o direito de modificar, suspender ou descontinuar, temporária ou permanentemente, qualquer funcionalidade da plataforma, mediante comunicação prévia aos usuários com no mínimo 15 (quinze) dias de antecedência, exceto em casos de urgência técnica ou legal.</P>
        </Section>

        <Section title="8. Limitação de Responsabilidade">
          <P>Na extensão máxima permitida pela legislação aplicável, a Sirius Strategy não se responsabiliza por:</P>
          <Ul items={[
            'Resultados profissionais ou financeiros decorrentes da aplicação dos conteúdos aprendidos na plataforma;',
            'Danos indiretos, incidentais, especiais ou consequentes resultantes do uso ou impossibilidade de uso da plataforma;',
            'Conteúdos de terceiros acessados por meio de links ou referências presentes na plataforma;',
            'Falhas em serviços de terceiros integrados à plataforma (provedores de pagamento, serviços de autenticação, infraestrutura de nuvem);',
            'Perda de dados decorrente de condutas do próprio usuário ou de eventos fora do controle razoável da Sirius Strategy.',
          ]} />
          <P>Em qualquer hipótese, a responsabilidade total da Sirius Strategy perante o usuário fica limitada ao valor efetivamente pago pelo usuário à plataforma nos últimos 12 (doze) meses anteriores ao evento gerador do dano.</P>
        </Section>

        <Section title="9. Privacidade e Proteção de Dados">
          <P>O tratamento dos dados pessoais dos usuários é regido pela nossa <Link href="/privacidade" style={{ color: '#7B9FFF', textDecoration: 'none', fontWeight: 600 }}>Política de Privacidade</Link>, elaborada em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Ao aceitar estes Termos, o usuário declara ter lido e concordado também com a Política de Privacidade.</P>
        </Section>

        <Section title="10. Rescisão">
          <P><strong style={{ color: '#C5CCEE' }}>10.1 Por iniciativa do usuário.</strong> O usuário pode encerrar sua conta a qualquer momento, mediante solicitação pelo e-mail de suporte. O encerramento não gera direito a reembolso de valores já pagos, exceto nas hipóteses previstas na Política de Reembolso (cláusula 4.4).</P>
          <P><strong style={{ color: '#C5CCEE' }}>10.2 Por iniciativa da Sirius Academy.</strong> A Sirius Strategy pode suspender ou encerrar a conta do usuário, com ou sem aviso prévio, em caso de violação destes Termos, prática de condutas fraudulentas ou determinação legal.</P>
          <P><strong style={{ color: '#C5CCEE' }}>10.3 Efeitos da rescisão.</strong> Com o encerramento da conta, o usuário perde o acesso a todos os conteúdos e recursos da plataforma. Dados pessoais serão tratados conforme a Política de Privacidade.</P>
        </Section>

        <Section title="11. Alterações nos Termos de Uso">
          <P>A Sirius Strategy pode modificar estes Termos a qualquer momento. Alterações substanciais serão comunicadas aos usuários cadastrados por e-mail com no mínimo 10 (dez) dias de antecedência. O uso continuado da plataforma após a entrada em vigor das alterações implica aceitação dos novos termos. Caso o usuário não concorde com as modificações, deverá encerrar sua conta antes da data de vigência das alterações.</P>
        </Section>

        <Section title="12. Lei Aplicável e Foro">
          <P>Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para a resolução de quaisquer controvérsias decorrentes destes Termos, fica eleito o foro da comarca de domicílio do usuário, conforme determina o artigo 101, inciso I, do Código de Defesa do Consumidor (Lei nº 8.078/1990), renunciando as partes a qualquer outro, por mais privilegiado que seja.</P>
        </Section>

        <Section title="13. Contato e Suporte">
          <P>Para dúvidas, solicitações ou reclamações relacionadas a estes Termos de Uso, entre em contato pelos canais abaixo:</P>
          <div style={{
            background: 'rgba(59,91,219,0.06)',
            border: '1px solid rgba(59,91,219,0.15)',
            borderRadius: 10, padding: '18px 22px',
            marginTop: 8,
          }}>
            <div style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 2 }}>
              <div><strong>Empresa:</strong> Sirius Strategy</div>
              <div><strong>E-mail:</strong> siriustrategy@gmail.com</div>
              <div><strong>Plataforma:</strong> https://sirius-academy-production.up.railway.app</div>
              <div><strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h (horário de Brasília)</div>
            </div>
          </div>
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
          <Link href="/termos" style={{ fontSize: 12, color: '#3B5BDB', textDecoration: 'none', fontWeight: 600 }}>Termos de Uso</Link>
          <Link href="/privacidade" style={{ fontSize: 12, color: '#4A5270', textDecoration: 'none' }}>Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  )
}
