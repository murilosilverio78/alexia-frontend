import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const areas = [
  "Direito Civil",
  "Direito Penal",
  "Direito do Trabalho (CLT)",
  "Direito do Consumidor",
  "Direito Processual Civil",
  "Direito Processual Penal",
  "LGPD",
  "ECA",
  "Direito Previdenciário",
  "Lei de Locações",
  "Direito Constitucional",
  "Súmulas STF/STJ",
];

const faqItems = [
  {
    question: "A Alexia substitui um advogado?",
    answer:
      "Não. A Alexia fornece informações jurídicas fundamentadas para orientar sua situação, mas não substitui a assessoria de um advogado habilitado para casos complexos ou que exijam representação judicial.",
  },
  {
    question: "Quanto tempo leva para receber o parecer?",
    answer:
      "Entre 2 e 3 minutos. Nossos agentes de IA pesquisam simultaneamente múltiplos corpora jurídicos antes de emitir o parecer.",
  },
  {
    question: "Meus dados são confidenciais?",
    answer:
      "Sim. Suas consultas são armazenadas de forma segura e não são compartilhadas com terceiros.",
  },
  {
    question: "Quais áreas do direito a Alexia cobre?",
    answer:
      "Direito Civil, Penal, Trabalhista, do Consumidor, Processual Civil e Penal, LGPD, ECA, Previdenciário, Locações, Constitucional e súmulas dos tribunais superiores.",
  },
  {
    question: "Posso usar a Alexia pelo celular?",
    answer:
      "Sim. A plataforma é totalmente responsiva e funciona em qualquer dispositivo.",
  },
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="min-h-screen bg-app-shell">
      <header
        className={[
          "fixed inset-x-0 top-0 z-40 transition duration-200 motion-reduce:transition-none",
          scrolled
            ? "border-b border-border/80 bg-surface/95 shadow-soft backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-3 rounded-2xl text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft">
              <Scale className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">
              Alexia
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#como-funciona"
              className="text-sm font-semibold text-text-muted transition duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
            >
              Como funciona
            </a>
            <a
              href="#areas"
              className="text-sm font-semibold text-text-muted transition duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
            >
              Áreas do direito
            </a>
            <a
              href="#faq"
              className="text-sm font-semibold text-text-muted transition duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="button-secondary hidden sm:inline-flex"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="button-primary"
            >
              Começar grátis
            </button>
          </div>
        </div>
      </header>

      <main className="overflow-hidden pt-24 sm:pt-28">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 lg:grid-cols-[minmax(0,1.15fr)_460px] lg:items-center">
          <div data-reveal className="reveal-on-scroll">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary-700">
              Assessoria jurídica com IA
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[0.96] tracking-tight text-text">
              Sua dúvida jurídica respondida em minutos
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
              A Alexia analisa sua situação com base na legislação brasileira
              atualizada e entrega um parecer jurídico fundamentado direto no
              seu email.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="button-primary"
              >
                Fazer minha primeira consulta
              </button>
              <a href="#como-funciona" className="button-secondary">
                Ver como funciona
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-text-muted">
              <span className="rounded-full bg-surface px-4 py-2 shadow-soft">
                Gratuito para começar
              </span>
              <span className="rounded-full bg-surface px-4 py-2 shadow-soft">
                Resposta em até 3 minutos
              </span>
              <span className="rounded-full bg-surface px-4 py-2 shadow-soft">
                Fundamentação legal completa
              </span>
            </div>
          </div>

          <div data-reveal className="reveal-on-scroll lg:justify-self-end">
            <div className="card-base rounded-[32px] border-primary-700/10 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
                    Exemplo de sessão
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-text">
                    Parecer em andamento
                  </h2>
                </div>
                <span className="rounded-full bg-info-bg px-3 py-1 text-xs font-semibold text-info-fg">
                  Em análise
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-surface-soft p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-text-muted">
                    Pergunta
                  </p>
                  <p className="mt-3 text-base leading-7 text-text">
                    Meu empregador atrasou meu salário por 3 meses. Quais são
                    meus direitos e quais medidas posso tomar imediatamente?
                  </p>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <div className="flex items-center gap-2 text-primary-700">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-sm font-semibold">
                      Pesquisa jurídica multicamada
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">
                    A Alexia cruza legislação aplicável, súmulas, entendimentos
                    consolidados e lacunas relevantes antes de enviar o parecer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          data-reveal
          className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12 sm:py-16"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
              Como funciona
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
              Como a Alexia funciona
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Descreva sua dúvida",
                text: "Explique sua situação jurídica com suas próprias palavras. Não precisa usar termos técnicos.",
              },
              {
                icon: Scale,
                title: "A IA analisa a legislação",
                text: "Nossos agentes especializados pesquisam o Código Civil, CLT, CDC, CP e outros 10 corpora jurídicos simultaneamente.",
              },
              {
                icon: Mail,
                title: "Receba o parecer",
                text: "Um parecer jurídico fundamentado chega no seu email e fica disponível no histórico para consulta futura.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="card-base rounded-[24px] p-6 transition duration-200 hover:shadow-elevated motion-reduce:transition-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-text">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-7 text-text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="areas"
          data-reveal
          className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12 sm:py-16"
        >
          <div className="card-base rounded-[32px] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
              Cobertura jurídica
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
              Áreas cobertas pela Alexia
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-semibold text-text"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-base leading-7 text-text-muted">
              Todos os pareceres são fundamentados na legislação vigente e nas
              súmulas dos tribunais superiores.
            </p>
          </div>
        </section>

        <section
          data-reveal
          className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12 sm:py-16"
        >
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
                Exemplo de parecer
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
                Veja um exemplo de parecer
              </h2>
            </div>

            <div className="card-base rounded-[32px] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success-fg">
                  Alta confiança
                </span>
                <span className="text-sm font-medium text-text-muted">
                  Fundamentação: CLT art. 459, Súmula 466/STJ
                </span>
              </div>
              <div className="mt-6 rounded-3xl bg-surface-soft p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-text-muted">
                  Pergunta
                </p>
                <p className="mt-3 text-base leading-7 text-text">
                  Meu empregador atrasou meu salário por 3 meses. Quais são meus
                  direitos?
                </p>
              </div>
              <div className="mt-5 border border-border p-5">
                <p className="font-serif text-2xl font-semibold text-text">
                  Parecer resumido
                </p>
                <p className="mt-3 text-base leading-7 text-text-muted">
                  O atraso reiterado no pagamento de salários pode configurar
                  descumprimento contratual grave, com repercussões trabalhistas
                  relevantes. Em regra, é possível pleitear regularização
                  imediata, rescisão indireta e verbas correlatas, a depender do
                  contexto probatório e da habitualidade do atraso.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="button-primary mt-6"
              >
                Fazer minha consulta
              </button>
            </div>
          </div>
        </section>

        <section
          id="faq"
          data-reveal
          className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12 sm:py-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
            FAQ
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
            Perguntas frequentes
          </h2>
          <div className="mt-8 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <article
                  key={item.question}
                  className="card-base rounded-[24px] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-serif text-2xl font-semibold text-text">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={[
                        "h-5 w-5 shrink-0 text-primary-700 transition duration-200 motion-reduce:transition-none",
                        isOpen ? "rotate-180" : "rotate-0",
                      ].join(" ")}
                    />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-border px-5 py-5 text-base leading-7 text-text-muted">
                      {item.answer}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section
          data-reveal
          className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12 sm:py-16"
        >
          <div className="rounded-[32px] bg-primary-700 px-6 py-10 text-white shadow-elevated sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Comece agora
            </p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-white">
              Pronto para esclarecer sua dúvida jurídica?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Crie sua conta gratuitamente e faça sua primeira consulta agora.
            </p>
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-soft transition duration-200 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 motion-reduce:transition-none"
            >
              Começar agora
            </button>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-8 pt-2 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-700 text-white">
            <Scale className="h-4 w-4" />
          </span>
          <div>
            <p className="font-serif text-xl font-semibold text-text">Alexia</p>
            <p>Assessoria jurídica com IA</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="/" className="font-medium text-text-muted hover:text-text">
            Termos de uso
          </a>
          <a href="/" className="font-medium text-text-muted hover:text-text">
            Privacidade
          </a>
        </div>
        <p>© 2025 Alexia · As respostas têm caráter informativo e não substituem assessoria jurídica profissional.</p>
      </footer>
    </div>
  );
}
