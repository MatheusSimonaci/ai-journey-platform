import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | AI Journey Platform",
  description: "Nossa política de privacidade",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl prose prose-slate">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Voltar para o início
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          Política de Privacidade
        </h1>

        <p className="text-slate-600 mb-8">
          <strong>Data de vigência:</strong> 22 de abril de 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            1. Introdução
          </h2>
          <p>
            A AI Journey Platform (&quot;Plataforma&quot;, &quot;nós&quot;, &quot;nosso&quot;) está comprometida
            com a proteção de sua privacidade. Esta Política de Privacidade
            explica como coletamos, usamos, armazenamos e protegemos suas
            informações quando você usa nossa Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            2. Informações que Coletamos
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            2.1 Informações de Autenticação
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Endereço de email</li>
            <li>Nome (opcional)</li>
            <li>Informações de conta do Google (se usar login via Google)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            2.2 Informações de Onboarding
          </h3>
          <p>
            Quando você completa nosso formulário de onboarding, coletamos suas
            respostas sobre:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Nível de experiência com IA</li>
            <li>Objetivos principais (informativo, aplicado, construir produtos, pesquisa)</li>
            <li>Contexto de domínio ou indústria</li>
            <li>Tempo disponível por semana</li>
            <li>Estilo de aprendizado preferido</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            2.3 Dados de Progresso e Interação
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Recursos marcados como concluídos, pulados ou marcados</li>
            <li>Caminhos de aprendizado gerados e atualizações</li>
            <li>Data e hora do último acesso</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            2.4 Dados Técnicos
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Endereço IP</li>
            <li>Tipo de navegador e sistema operacional</li>
            <li>Páginas visitadas e tempo gasto</li>
            <li>Informações de cookies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            3. Como Usamos Suas Informações
          </h2>

          <p>Usamos suas informações para:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Autenticar sua conta e manter sua sessão</li>
            <li>Gerar seu perfil de estágio de IA e caminho de aprendizado personalizado</li>
            <li>Armazenar suas respostas de onboarding e progresso</li>
            <li>Melhorar e otimizar a Plataforma</li>
            <li>Comunicar com você sobre a Plataforma</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <p className="mt-4">
            <strong>Importante:</strong> Suas respostas de onboarding são usadas
            <strong> exclusivamente</strong> para gerar seu caminho personalizado.
            Não vendemos, compartilhamos ou usamos seus dados para fins publicitários.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            4. Armazenamento e Segurança de Dados
          </h2>

          <p>
            Seus dados são armazenados em servidores seguros no banco de dados
            Neon (infraestrutura de Postgres gerenciada). Implementamos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Criptografia em trânsito (HTTPS/TLS)</li>
            <li>Autenticação segura com tokens HttpOnly, Secure, SameSite=Strict</li>
            <li>Controle de acesso baseado em função</li>
            <li>Logging de segurança e monitoramento</li>
          </ul>

          <p className="mt-4">
            Embora implementemos medidas de segurança robustas, nenhum sistema é
            100% seguro. Encorajamos você a usar senhas fortes e a manter sua
            conta segura.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            5. Compartilhamento de Dados
          </h2>

          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com
            terceiros, exceto:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Claude API (Anthropic):</strong> Suas respostas de onboarding
              são enviadas à Claude API para gerar seu caminho. Consulte a política
              de privacidade da Anthropic.
            </li>
            <li>
              <strong>Provedores de serviço:</strong> Fornecedores de hospedagem,
              email e segurança que ajudam a operar a Plataforma.
            </li>
            <li>
              <strong>Requisições legais:</strong> Se exigido por lei ou ordem judicial.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            6. Direitos do Usuário (GDPR e LGPD)
          </h2>

          <p>
            Se você está na União Europeia, Reino Unido ou Brasil, você tem
            direitos sobre seus dados:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            Seu Direito de:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Acessar:</strong> Solicitar uma cópia de todos os seus dados
            </li>
            <li>
              <strong>Corrigir:</strong> Corrigir dados imprecisos
            </li>
            <li>
              <strong>Apagar:</strong> Solicitar a exclusão de sua conta e todos
              os dados associados
            </li>
            <li>
              <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
            </li>
            <li>
              <strong>Revogar consentimento:</strong> Retirar consentimento a qualquer momento
            </li>
          </ul>

          <p className="mt-4">
            Para exercer esses direitos, entre em contato com{" "}
            <a href="mailto:privacy@aijourneyplatform.com" className="text-blue-600 hover:underline">
              privacy@aijourneyplatform.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            7. Retenção de Dados
          </h2>

          <p>
            Retemos seus dados pessoais enquanto sua conta estiver ativa. Se você
            solicitar a exclusão da conta:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Seus dados são deletados dentro de 30 dias</li>
            <li>Dados agregados anônimos podem ser retidos para fins analíticos</li>
            <li>Dados de transação podem ser retidos conforme exigido por lei</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            8. Cookies e Tecnologias de Rastreamento
          </h2>

          <p>
            Usamos cookies para manter você conectado e melhorar sua experiência:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Cookies de autenticação:</strong> Necessários para manter
              você conectado
            </li>
            <li>
              <strong>Cookies de preferência:</strong> Lembram suas escolhas
            </li>
          </ul>

          <p className="mt-4">
            Você pode controlar cookies através de suas configurações do navegador.
            Desabilitar cookies pode afetar a funcionalidade da Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            9. Privacidade de Menores
          </h2>

          <p>
            Nossa Plataforma não é direcionada a menores de 13 anos. Não coletamos
            intencionalmente dados de menores de 13 anos. Se descobrirmos que
            coletamos dados de menores, deletaremos imediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            10. Transferências Internacionais
          </h2>

          <p>
            Seus dados podem ser transferidos para, armazenados e processados em
            países diferentes do seu país de residência. Essas transferências seguem
            as proteções adequadas sob GDPR e legislações de privacidade aplicáveis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            11. Alterações a Esta Política
          </h2>

          <p>
            Podemos atualizar esta política de tempos em tempos. Quando fizermos
            mudanças materiais, notificaremos você por email ou por um aviso
            proeminente na Plataforma. Seu uso contínuo significa aceitação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            12. Contato
          </h2>

          <p>
            Se você tem perguntas sobre esta Política de Privacidade, entre em contato:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@aijourneyplatform.com" className="text-blue-600 hover:underline">
                privacy@aijourneyplatform.com
              </a>
            </p>
            <p className="mt-2">
              <strong>Endereço:</strong> São Paulo, Brasil
            </p>
          </div>
        </section>

        <hr className="my-8" />
        <p className="text-sm text-slate-500">
          Última atualização: 22 de abril de 2026
        </p>
      </div>
    </main>
  );
}
