import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Sobre</h3>
            <p className="text-sm text-slate-600">
              AI Journey Platform ajuda você a encontrar seu caminho na inteligência artificial.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-slate-600 hover:text-slate-900">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-600 hover:text-slate-900">
                  Início
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-slate-900">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <a
                  href="mailto:legal@aijourneyplatform.com"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8">
          <p className="text-sm text-slate-500 text-center">
            © 2026 AI Journey Platform. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
