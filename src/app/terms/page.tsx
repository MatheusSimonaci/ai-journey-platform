import Link from "next/link";

export const metadata = {
  title: "Termos de Serviço | AI Journey Platform",
  description: "Nossos termos de serviço",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl prose prose-slate">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Voltar para o início
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          Termos de Serviço
        </h1>

        <p className="text-slate-600 mb-8">
          <strong>Data de vigência:</strong> 22 de abril de 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            1. Aceita dos Termos
          </h2>
          <p>
            Ao acessar e usar a AI Journey Platform (&quot;Plataforma&quot;), você concorda
            em ficar vinculado a estes Termos de Serviço. Se você não concorda com
            alguma parte destes termos, não pode usar a Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            2. Descrição do Serviço
          </h2>
          <p>
            A AI Journey Platform é uma aplicação web que oferece:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Formulário de onboarding para avaliar seu nível de experiência em IA
            </li>
            <li>
              Geração de caminhos de aprendizado personalizados usando a Claude API
            </li>
            <li>
              Dashboard para visualizar e rastrear seu progresso em recursos de
              aprendizado
            </li>
            <li>
              Acesso a uma biblioteca curada de recursos sobre inteligência artificial
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            3. Conta de Usuário
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            3.1 Criação de Conta
          </h3>
          <p>
            Você é responsável por manter a confidencialidade de suas credenciais
            de login. Você concorda em:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Fornecer informações precisas e completas durante o cadastro
            </li>
            <li>
              Notificar-nos imediatamente de qualquer acesso não autorizado
            </li>
            <li>
              Usar a Plataforma apenas para fins legítimos
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            3.2 Responsabilidade de Conta
          </h3>
          <p>
            Você é totalmente responsável por toda atividade que ocorre em sua conta,
            incluindo qualquer acesso não autorizado ou uso fraudulento.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            3.3 Encerramento de Conta
          </h3>
          <p>
            Você pode solicitar a exclusão de sua conta a qualquer momento
            contactando suporte. Ao deletar sua conta:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Todos os seus dados pessoais serão deletados dentro de 30 dias
            </li>
            <li>
              Dados de transação podem ser retidos conforme exigido por lei
            </li>
            <li>
              Não podemos recuperar dados deletados
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            4. Uso Aceitável
          </h2>

          <p>
            Você concorda em não usar a Plataforma de forma que:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Viole leis, regulações ou direitos de terceiros
            </li>
            <li>
              Transmita malware, vírus ou código prejudicial
            </li>
            <li>
              Realiza hacking, phishing ou tentativas de acesso não autorizado
            </li>
            <li>
              Interrompe ou compromete a integridade da Plataforma
            </li>
            <li>
              Realiza spam, harrassment ou abuso de outros usuários
            </li>
            <li>
              Coleta dados automaticamente ou raspa conteúdo sem permissão
            </li>
            <li>
              Viola a propriedade intelectual de terceiros
            </li>
            <li>
              Usa a Plataforma para fins comerciais sem autorização
            </li>
          </ul>

          <p className="mt-4">
            Nos reservamos o direito de suspender ou encerrar sua conta se violarmos
            estes termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            5. Propriedade Intelectual
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            5.1 Nosso Conteúdo
          </h3>
          <p>
            Todo conteúdo da Plataforma — incluindo layout, design, texto, gráficos,
            logotipos — é propriedade nossa ou de nossos licenciadores e protegido
            por leis de direitos autorais.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            5.2 Sua Licença
          </h3>
          <p>
            Concedemos a você uma licença limitada, não-exclusiva e revogável para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Acessar a Plataforma para uso pessoal e não-comercial
            </li>
            <li>
              Visualizar e fazer download de conteúdo para seu próprio uso
            </li>
          </ul>

          <p className="mt-4">
            Você não pode reproduzir, modificar, distribuir ou transmitir qualquer
            conteúdo sem nossa permissão prévia.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            5.3 Seu Conteúdo
          </h3>
          <p>
            Você retém todos os direitos sobre o conteúdo que você cria (suas
            respostas de onboarding, anotações, etc.). Ao usar a Plataforma, você
            nos concede licença para armazenar e processar esse conteúdo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            6. Isenção de Garantias
          </h2>

          <p>
            A Plataforma é fornecida &quot;COMO ESTÁ&quot; e &quot;CONFORME DISPONÍVEL&quot;, SEM
            GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS. Especificamente:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Não garantimos que o serviço será ininterrupto, seguro ou sem erros
            </li>
            <li>
              Não garantimos a precisão, adequação ou confiabilidade do conteúdo
            </li>
            <li>
              Caminhos de aprendizado são baseados em IA; podem conter imprecisões
            </li>
            <li>
              Não somos responsáveis pelo conteúdo externo (recursos, links)
            </li>
          </ul>

          <p className="mt-4">
            <strong>A Plataforma não substitui aconselhamento profissional.</strong> Use
            por sua conta e risco.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            7. Limitação de Responsabilidade
          </h2>

          <p>
            NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI, NÃO SEREMOS RESPONSÁVEIS POR
            DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENTES OU PUNITIVOS,
            INCLUINDO PERDA DE LUCROS OU DADOS.
          </p>

          <p className="mt-4">
            Nossa responsabilidade total por qualquer reclamação não excederá o
            montante pago por você à Plataforma nos últimos 12 meses (ou $0 se
            você não pagou).
          </p>

          <p className="mt-4">
            Algumas jurisdições não permitem limitações de responsabilidade, então
            esta limitação pode não se aplicar a você.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            8. Indenização
          </h2>

          <p>
            Você concorda em indenizar, defender e manter indene a Plataforma e
            seus desenvolvedores de qualquer reclamação, dano ou custo (incluindo
            honorários advocatícios) decorrentes de:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Seu uso da Plataforma
            </li>
            <li>
              Violação destes Termos
            </li>
            <li>
              Seu conteúdo ou atividade
            </li>
            <li>
              Violação de direitos de terceiros
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            9. Links Externos e Recursos de Terceiros
          </h2>

          <p>
            A Plataforma fornece links para recursos e conteúdos externos. Não:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Endossamos ou somos responsáveis pelo conteúdo externo
            </li>
            <li>
              Controlamos sites de terceiros ou sua privacidade
            </li>
            <li>
              Garantimos disponibilidade contínua de links externos
            </li>
          </ul>

          <p className="mt-4">
            Use recursos externos por sua conta e risco. Revise suas políticas de
            privacidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            10. Modificações do Serviço
          </h2>

          <p>
            Nos reservamos o direito de:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Modificar ou descontinuar recursos a qualquer momento
            </li>
            <li>
              Alterar preços ou políticas com notificação prévia
            </li>
            <li>
              Fazer manutenção que pode resultar em downtime
            </li>
          </ul>

          <p className="mt-4">
            Seu uso contínuo significa aceitação de modificações.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            11. Suspensão e Rescisão
          </h2>

          <p>
            Podemos suspender ou encerrar sua conta se:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Você violar estes Termos de Serviço
            </li>
            <li>
              Sua conta for usada para atividades ilícitas
            </li>
            <li>
              Você for inativo por mais de 2 anos
            </li>
            <li>
              Exigido por lei ou obrigação regulatória
            </li>
          </ul>

          <p className="mt-4">
            Faremos esforço comercialmente razoável para notificá-lo antes da
            encerração, a menos que infringimentos sérios ocorram.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            12. Conformidade Legal
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            12.1 Governança e Lei Aplicável
          </h3>
          <p>
            Estes Termos são governados pela lei de São Paulo, Brasil, sem
            considerar conflitos de leis. Você concorda em submeter-se à
            jurisdição dos tribunais localizados em São Paulo.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            12.2 Conformidade GDPR/LGPD
          </h3>
          <p>
            Se você está na União Europeia ou Brasil, você tem direitos de
            privacidade adicionais. Consulte nossa Política de Privacidade.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800">
            12.3 Conformidade de Exportação
          </h3>
          <p>
            A Plataforma é controlada pelos EUA. Você concorda em conformidade
            com todas as leis de controle de exportação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            13. Divisibilidade
          </h2>

          <p>
            Se qualquer disposição destes Termos for inválida ou inforçável, as
            disposições restantes permanecerão em vigor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            14. Renúncia
          </h2>

          <p>
            Nossa falha em aplicar qualquer direito ou disposição não constitui
            renúncia a esse direito ou disposição.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            15. Acordo Integral
          </h2>

          <p>
            Estes Termos, juntamente com nossa Política de Privacidade, constituem
            o acordo integral entre você e a Plataforma, superando toda
            negociação anterior.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            16. Alterações a Estes Termos
          </h2>

          <p>
            Podemos atualizar estes Termos a qualquer momento. Notificaremos
            você de mudanças materiais por email ou por um aviso na Plataforma.
            Seu uso contínuo significa aceitação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">
            17. Contato
          </h2>

          <p>
            Para perguntas sobre estes Termos de Serviço, entre em contato:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:legal@aijourneyplatform.com" className="text-blue-600 hover:underline">
                legal@aijourneyplatform.com
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
