document.addEventListener("DOMContentLoaded", () => {

  // Directory data supplied for the current project version.
  // These records should be independently verified before final publication.
  const cooperatives = [
  {
    "name": "COOHABEL – Cooperativa Metropolitana de Habitação Popular de Belo Horizonte Ltda.",
    "acronym": "COOHABEL",
    "cnpj": "04.791.139/0001-51",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua São Paulo, 1106, sala 1802, Centro, Belo Horizonte – MG, 30170-133",
    "lat": -19.924,
    "lng": -43.9415
  },
  {
    "name": "COHAM – Cooperativa Habitacional do Estado de Minas Gerais Ltda.",
    "acronym": "COHAM",
    "cnpj": "03.543.435/0001-70",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Juiz de Fora, 115, sala 1401, Barro Preto, Belo Horizonte – MG, 30180-060",
    "lat": -19.9239,
    "lng": -43.9537
  },
  {
    "name": "COOPALASKA – Cooperativa Alaska Empreendimentos Habitacionais Ltda.",
    "acronym": "COOPALASKA",
    "cnpj": "07.376.603/0001-31",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Geraldo Silva, 145, Rio Branco, Belo Horizonte – MG, 31535-250",
    "lat": -19.8215,
    "lng": -43.9932
  },
  {
    "name": "Cooperativa Habitacional dos Bancários de Belo Horizonte e Região – COOPHAB",
    "acronym": "COOPHAB",
    "cnpj": "24.740.690/0001-83",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Ceará, 741, sala 201A, Santa Efigênia, Belo Horizonte – MG, 30150-312",
    "lat": -19.9276,
    "lng": -43.9272
  },
  {
    "name": "Cooperativa Habitacional Operário Riacho das Pedras",
    "acronym": "—",
    "cnpj": "19.523.414/0001-23",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Mármore, 850, Santa Tereza, Belo Horizonte – MG, 31010-220",
    "lat": -19.9172,
    "lng": -43.9145
  },
  {
    "name": "Cooperativa Habitacional Intersindical",
    "acronym": "—",
    "cnpj": "16.518.631/0001-37",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Mármore, 850, Santa Tereza, Belo Horizonte – MG, 31010-220",
    "lat": -19.9172,
    "lng": -43.9145
  },
  {
    "name": "COOHAIME-MG – Cooperativa Habitacional das Instituições Militares do Estado de Minas Gerais",
    "acronym": "COOHAIME-MG",
    "cnpj": "03.888.516/0001-02",
    "city": "Belo Horizonte",
    "region": "Belo Horizonte",
    "status": "Cadastro informado",
    "address": "Rua Dom Oscar Romero, 500, Prédio 1, Nova Gameleira, Belo Horizonte – MG, 30510-080",
    "lat": -19.936,
    "lng": -43.9907
  },
  {
    "name": "COOPOM – Cooperativa Habitacional dos Policiais, Militares e Bombeiros do Brasil",
    "acronym": "COOPOM",
    "cnpj": "21.812.704/0001-39",
    "city": "Ribeirão das Neves",
    "region": "RMBH",
    "status": "Cadastro informado",
    "address": "Avenida Ceará, 381, Sevilha (2ª Seção), Ribeirão das Neves – MG, 33840-400",
    "lat": -19.7684,
    "lng": -44.0852
  }
];

  const directoryGrid = document.getElementById("directoryGrid");
  const directoryCount = document.getElementById("directoryCount");
  const emptyDirectory = document.getElementById("emptyDirectory");
  const cooperativeSearch = document.getElementById("cooperativeSearch");
  const cooperativeRegion = document.getElementById("cooperativeRegion");

  function normalizeText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function renderCooperatives() {
    if (!directoryGrid) return;
    const query = normalizeText(cooperativeSearch?.value || "");
    const region = cooperativeRegion?.value || "all";
    const filtered = cooperatives.filter((coop) => {
      const haystack = normalizeText([coop.name, coop.acronym, coop.cnpj, coop.city, coop.region].join(" "));
      const matchesQuery = !query || haystack.includes(query);
      const matchesRegion = region === "all" || (region === "bh" && coop.city === "Belo Horizonte") || (region === "rmbr" && coop.region === "RMBH");
      return matchesQuery && matchesRegion;
    });
    directoryGrid.innerHTML = filtered.map((coop) => `
      <article class="directory-card">
        <div class="card-top"><span>${coop.acronym !== "—" ? coop.acronym : "COOPERATIVA"}</span><span>${coop.city === "Belo Horizonte" ? "BH" : "RMBH"}</span></div>
        <h3>${coop.name}</h3>
        <p><strong>Localização:</strong> ${coop.city}<br><strong>CNPJ:</strong> ${coop.cnpj}</p>
        <div class="directory-meta"><span>${coop.status}</span><span>Fonte: cadastro informado no projeto</span></div>
      </article>`).join("");
    if (directoryCount) directoryCount.textContent = `${filtered.length} de ${cooperatives.length} registros`;
    if (emptyDirectory) emptyDirectory.hidden = filtered.length !== 0;
  }

  cooperativeSearch?.addEventListener("input", renderCooperatives);
  cooperativeRegion?.addEventListener("change", renderCooperatives);
  renderCooperatives();


  // Interactive Leaflet map using the reference coordinates supplied for the project.
  const mapElement = document.getElementById("cooperativeMap");
  if (mapElement && window.L) {
    const map = L.map(mapElement, {
      scrollWheelZoom: false,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
      zoomControl: true,
      preferCanvas: true
    }).setView([-19.905, -43.975], 11);

    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 8,
      maxZoom: 19,
      updateWhenZooming: false,
      updateWhenIdle: true,
      keepBuffer: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    tiles.on("tileerror", () => {
      mapElement.classList.add("map-tile-error");
    });

    tiles.on("load", () => {
      mapElement.classList.remove("map-tile-error");
    });

    const coopIcon = L.divIcon({
      className: "custom-map-marker",
      html: '<span></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });

    cooperatives.forEach((coop) => {
      if (!Number.isFinite(coop.lat) || !Number.isFinite(coop.lng)) return;
      const popup = `
        <div class="map-popup">
          <strong>${coop.acronym !== "—" ? coop.acronym : coop.name}</strong>
          <span>${coop.city}</span>
          <span>${coop.address}</span>
          <small>CNPJ: ${coop.cnpj}</small>
        </div>`;
      L.marker([coop.lat, coop.lng], { icon: coopIcon }).addTo(map).bindPopup(popup);
    });

    const markerPoints = cooperatives
      .filter((coop) => Number.isFinite(coop.lat) && Number.isFinite(coop.lng))
      .map((coop) => [coop.lat, coop.lng]);

    if (markerPoints.length) {
      map.fitBounds(markerPoints, { padding: [28, 28], maxZoom: 13 });
    }

    requestAnimationFrame(() => {
      map.invalidateSize(true);
      setTimeout(() => map.invalidateSize(true), 250);
    });

    if (window.ResizeObserver) {
      const mapObserver = new ResizeObserver(() => map.invalidateSize());
      mapObserver.observe(mapElement);
    }
  }

  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  const form = document.getElementById("interestForm");
  const formResult = document.getElementById("formResult");

  if (form && formResult) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const region = document.getElementById("region").value;
      const interest = document.getElementById("interest").value;

      if (!name || !region || !interest) {
        formResult.textContent = "Preencha nome, região e tipo de interesse.";
        formResult.style.color = "#a44925";
        return;
      }

      /*
       * Prototype behavior:
       * Data is kept only in the browser. In the next phase,
       * this can be replaced with a Google Form, Formspree,
       * Apps Script, Supabase, or another backend.
       */
      const entry = {
        name,
        region,
        interest,
        budget: document.getElementById("budget").value,
        familyCount: document.getElementById("familyCount")?.value || "",
        memberCount: document.getElementById("memberCount")?.value || "",
        householdIncome: document.getElementById("householdIncome")?.value || "",
        message: document.getElementById("message").value.trim(),
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem("cooperarInteresses") || "[]");
      existing.push(entry);
      localStorage.setItem("cooperarInteresses", JSON.stringify(existing));

      formResult.textContent = "Interesse salvo localmente neste navegador. Nada foi enviado ao projeto.";
      formResult.style.color = "#234b42";
      form.reset();
    });
  }

  // Local-first guided legal readiness report (no server transmission).
  const assessmentForm = document.getElementById("legalAssessmentForm");
  const reportWrap = document.getElementById("reportWrap");
  const reportContent = document.getElementById("reportContent");
  let latestAssessmentReport = "";

  function getLocalInterestEntries() {
    try {
      const parsed = JSON.parse(localStorage.getItem("cooperarInteresses") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function setSelectIfAvailable(select, value) {
    if (!select || !value) return;
    const options = Array.from(select.options);
    const option = options.find((item) => item.value === value || item.textContent.trim() === value);
    if (option) select.value = option.value || option.textContent.trim();
  }

  const importInterestData = document.getElementById("importInterestData");
  const importStatus = document.getElementById("importStatus");
  if (importInterestData) {
    importInterestData.addEventListener("click", () => {
      const entries = getLocalInterestEntries();
      const latest = entries.length ? entries[entries.length - 1] : null;
      if (!latest) {
        if (importStatus) importStatus.textContent = "Nenhum registro local foi encontrado. Preencha o formulário manualmente ou use a seção Participar na página inicial.";
        return;
      }
      setSelectIfAvailable(document.getElementById("assessmentRegion"), latest.region);
      if (latest.familyCount) document.getElementById("assessmentFamilies").value = latest.familyCount;
      if (latest.memberCount) document.getElementById("assessmentMembers").value = latest.memberCount;
      setSelectIfAvailable(document.getElementById("assessmentIncome"), latest.householdIncome);
      if (importStatus) importStatus.textContent = "Dados locais importados para os campos disponíveis. Confira e complete os números antes de gerar o relatório.";
    });
  }

  function checkedLegalNeeds() {
    return Array.from(document.querySelectorAll('input[name="legalNeeds"]:checked')).map((item) => item.value);
  }

  function buildAssessmentReport() {
    const region = document.getElementById("assessmentRegion").value;
    const stageSelect = document.getElementById("groupStage");
    const stage = stageSelect.options[stageSelect.selectedIndex]?.textContent || "Não informado";
    const families = Number(document.getElementById("assessmentFamilies").value);
    const members = Number(document.getElementById("assessmentMembers").value);
    const income = document.getElementById("assessmentIncome").value;
    const land = document.getElementById("landStatus").value;
    const notes = document.getElementById("assessmentNotes").value.trim();
    const needs = checkedLegalNeeds();
    const landLabels = {
      none: "Ainda não identificado",
      identified: "Terreno em vista, ainda sem análise",
      reviewing: "Análise em andamento",
      acquired: "Informado como adquirido ou sob controle do grupo"
    };

    const lines = [];
    lines.push("COOPERAR PARA HABITAR — RELATÓRIO PRELIMINAR DE ORGANIZAÇÃO");
    lines.push("Gerado em: " + new Date().toLocaleString("pt-BR"));
    lines.push("Natureza: ferramenta informativa e acadêmica; não é parecer jurídico nem valida a constituição da cooperativa.");
    lines.push("");
    lines.push("1. PERFIL INFORMADO");
    lines.push("Região pretendida: " + region);
    lines.push("Etapa: " + stage);
    lines.push("Famílias interessadas (estimativa): " + families);
    lines.push("Pessoas que poderiam ser cooperadas (estimativa): " + members);
    lines.push("Faixa de renda familiar mensal: " + income);
    lines.push("Situação declarada do terreno: " + (landLabels[land] || "Não informada"));
    lines.push("");
    lines.push("2. LEITURA INICIAL");

    if (members < 20) {
      lines.push("• Número de potenciais cooperados abaixo do mínimo geral de 20 pessoas para uma cooperativa singular. O grupo deve ampliar e confirmar o conjunto de associados fundadores, considerando a legislação e eventuais regras específicas aplicáveis.");
    } else {
      lines.push("• Número informado atinge o mínimo geral de 20 pessoas para uma cooperativa singular. Isso resolve apenas a referência numérica inicial; não comprova elegibilidade de cada membro nem regularidade dos documentos ou do projeto.");
    }
    lines.push("• O número de famílias e o número de pessoas cooperadas são métricas diferentes. Uma família não equivale automaticamente a um associado.");
    lines.push("• A faixa de renda indicada não é um requisito legal geral de constituição. Deve apoiar uma análise econômica preliminar de capacidade de contribuição, custos e acesso a financiamento, sem prometer aprovação de crédito ou benefício público.");
    if (land === "none") {
      lines.push("• Como ainda não há terreno identificado, priorize a definição do território e critérios de busca antes de assumir compromissos financeiros com um imóvel.");
    } else if (land === "identified") {
      lines.push("• Antes de sinal, promessa ou compra, conduza due diligence jurídica, registral, urbanística, ambiental e técnica do terreno.");
    } else if (land === "reviewing") {
      lines.push("• Não avance para compromisso irreversível até que a análise documental e técnica seja revisada pelos profissionais responsáveis e as condições de saída estejam contratualmente claras.");
    } else if (land === "acquired") {
      lines.push("• Confirme matrícula, titularidade, ônus, licenças, zoneamento, infraestrutura, passivos e compatibilidade do imóvel com o empreendimento; aquisição não significa aprovação automática para construir.");
    }
    if (region === "RMBH (fora de BH)") lines.push("• A RMBH reúne vários municípios: identifique o município exato do terreno, pois zoneamento, licenças e procedimentos urbanísticos variam localmente.");
    lines.push("");
    lines.push("3. PRÓXIMAS PROVIDÊNCIAS SUGERIDAS");
    const tasks = [];
    if (stage === "Apenas pesquisando a ideia") tasks.push("Realizar reunião exploratória e definir o problema habitacional, público, região e princípios de participação.");
    if (stage === "Reunindo pessoas interessadas") tasks.push("Criar uma lista voluntária de interessados com minimização de dados pessoais e marcar reunião para discutir objetivo e capacidade de contribuição.");
    if (stage === "Já realiza reuniões de organização") tasks.push("Documentar as decisões, responsabilidades, critérios de adesão e plano para confirmar os membros fundadores.");
    if (stage === "A cooperativa já foi constituída") tasks.push("Reunir estatuto, atas, comprovantes de registro, CNPJ, livros sociais e contratos para revisão jurídica/contábil e confirmar a situação registral atual.");
    tasks.push("Definir objeto social e avaliar com assessoria se o formato cooperativo é o mais adequado à finalidade habitacional pretendida.");
    tasks.push("Preparar minuta de Estatuto Social, regras internas e ata de constituição; prever ingresso, saída, inadimplência, devolução de quotas, resolução de conflitos, prestação de contas e proteção dos associados.");
    tasks.push("Confirmar atividade/CNAE, viabilidade do nome e endereço, documentação e processo de registro na JUCEMG; obter CNPJ e verificar registros, licenças e obrigações subsequentes conforme orientação oficial atual.");
    tasks.push("Estruturar um plano preliminar de viabilidade: custos do terreno, projeto, licenciamento, infraestrutura, construção, contingências, gestão e contribuições realistas.");
    tasks.push("Antes de contratar obras ou comprar terreno, submeter os instrumentos a análise jurídica e técnica independente.");
    if (land === "identified" || land === "reviewing" || land === "acquired") tasks.push("Concluir due diligence do terreno: matrícula atualizada, cadeia registral, ônus, zoneamento, parcelamento/uso, riscos ambientais, geotecnia, infraestrutura, acesso e restrições administrativas/judiciais.");
    needs.forEach((need) => tasks.push("Frente priorizada pelo grupo: " + need + "."));
    tasks.forEach((task, i) => lines.push((i + 1) + ". " + task));
    if (notes) {
      lines.push("");
      lines.push("4. OBSERVAÇÕES DO GRUPO");
      lines.push(notes);
    }
    lines.push("");
    lines.push("REFERÊNCIAS PARA CONFERÊNCIA");
    lines.push("DREI — Quero abrir uma cooperativa: https://www.gov.br/empresas-e-negocios/pt-br/drei/orientacoes-de-abertura/quero-abrir/quero-abrir-uma-cooperativa");
    lines.push("DREI — Instruções Normativas e manuais atuais: https://www.gov.br/empresas-e-negocios/pt-br/drei/legislacao/instrucoes-normativas");
    lines.push("Lei nº 5.764/1971: https://www.planalto.gov.br/ccivil_03/leis/l5764.htm");
    lines.push("JUCEMG: https://www.jucemg.mg.gov.br/");
    lines.push("");
    lines.push("Este documento é gerado automaticamente a partir das estimativas informadas. Ele não analisa documentos, não consulta bases oficiais, não substitui advogado, contador, arquiteto, engenheiro ou assessoria técnica e não garante acesso a financiamento, terreno ou política pública.");
    return lines.join("\n");
  }

  if (assessmentForm && reportWrap && reportContent) {
    assessmentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const families = Number(document.getElementById("assessmentFamilies").value);
      const members = Number(document.getElementById("assessmentMembers").value);
      if (!Number.isFinite(families) || families < 1 || !Number.isFinite(members) || members < 1) {
        alert("Informe pelo menos uma família e uma pessoa potencialmente cooperada.");
        return;
      }
      latestAssessmentReport = buildAssessmentReport();
      reportContent.replaceChildren();
      latestAssessmentReport.split("\n").forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line || " ";
        reportContent.appendChild(p);
      });
      reportWrap.hidden = false;
      reportWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function downloadTextFile(filename, text) {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById("downloadReport")?.addEventListener("click", () => {
    downloadTextFile("relatorio-preliminar-cooperar-para-habitar.txt", latestAssessmentReport);
  });
  document.getElementById("printReport")?.addEventListener("click", () => window.print());

  // Guided preparation for consensual discussion; it does not perform real mediation.
  const conflictForm = document.getElementById("conflictForm");
  const conflictReportWrap = document.getElementById("conflictReportWrap");
  const conflictReportContent = document.getElementById("conflictReportContent");
  let latestConflictAgenda = "";
  if (conflictForm && conflictReportWrap && conflictReportContent) {
    conflictForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = document.getElementById("conflictType").value;
      const issue = document.getElementById("conflictIssue").value.trim();
      const willingness = document.getElementById("conflictWillingness").value;
      const urgency = document.getElementById("conflictUrgency").value;
      const labels = {
        inadimplencia: "Inadimplência ou atraso de contribuição",
        desistencia: "Desistência, saída ou restituição de valores",
        governanca: "Governança ou transparência",
        obra: "Obra, cronograma, orçamento ou contrato",
        terreno: "Terreno ou regularização fundiária",
        relacional: "Conflito interpessoal ou quebra de confiança"
      };
      const lines = [
        "COOPERAR PARA HABITAR — PAUTA PREPARATÓRIA PARA CONVERSA",
        "Gerada em: " + new Date().toLocaleString("pt-BR"),
        "Tema: " + (labels[type] || "Divergência interna"),
        "Descrição neutra fornecida: " + issue,
        "Disposição para conversar: " + ({ yes: "Sim", unknown: "Ainda não sabemos", no: "Não" }[willingness] || "Não informado"),
        "Urgência declarada: " + (urgency === "yes" ? "Há risco urgente ou não se pode descartá-lo" : "Não identificado pelo usuário"),
        "",
        "ANTES DA REUNIÃO",
        "1. Consulte o Estatuto Social, Regimento Interno e contratos aplicáveis; não presuma penalidade, devolução ou prazo sem conferir os documentos.",
        "2. Reúna apenas documentos pertinentes e legalmente acessíveis. Separe fatos comprováveis de interpretações e alegações.",
        "3. Convide todas as partes relevantes em termos respeitosos, explicando finalidade, voluntariedade, formato, regras de participação e quem facilitará.",
        "4. Se houver conflito de interesses, assimetria significativa de poder ou valores/direitos relevantes, considere apoio de profissional jurídico independente e mediador imparcial.",
        "",
        "PAUTA SUGERIDA",
        "1. Cada parte apresenta sua compreensão do problema sem interrupção.",
        "2. Identificar fatos consensuais, pontos de divergência, documentos pendentes e impacto sobre o grupo/obra.",
        "3. Explicitar interesses e necessidades de cada lado, sem transformar a reunião em atribuição de culpa.",
        "4. Criar opções possíveis e avaliar custos, prazos, tratamento igualitário e efeito sobre os demais cooperados.",
        "5. Registrar apenas propostas aceitas: providência, responsável, prazo e forma de acompanhamento.",
        "6. Definir data de revisão e o que ocorrerá se não houver consenso; não tratar silêncio como aceitação.",
        "",
        "CUIDADOS ESPECÍFICOS"
      ];
      if (type === "inadimplencia") lines.push("• Conferir saldo, vencimentos, avisos prévios e regras válidas; discutir plano realista de regularização e critérios aplicados de forma consistente. Qualquer medida de exclusão, cobrança ou retenção precisa de revisão jurídica.");
      if (type === "desistencia") lines.push("• Conferir Estatuto, termo de adesão, contrato, quotas, investimentos efetivos, garantias, prazos e método de apuração/restituição. Não prometer valor ou prazo sem cálculos e validação documental.");
      if (type === "governanca") lines.push("• Conferir convocação, pauta, quórum, atas, direito de voz/voto, regras estatutárias e acesso às informações. Documentar decisões e eventuais dissensos de modo fiel.");
      if (type === "obra") lines.push("• Conferir escopo contratado, aditivos, medições, notas, cronograma, garantias, responsabilidade técnica e comunicações. Evitar atribuir falha técnica sem avaliação de profissional competente.");
      if (type === "terreno") lines.push("• Suspender novos compromissos irreversíveis se houver dúvida relevante sobre titularidade, ônus, licenciamento ou prazo; obter certidões, matrícula e análise urbanística/técnica independente.");
      if (type === "relacional") lines.push("• Definir limites de respeito e comunicação, permitir fala equilibrada e interromper a conversa se houver ameaça, intimidação ou risco à integridade de alguém.");
      lines.push("");
      lines.push("ALERTA");
      if (urgency === "yes") {
        lines.push("Foi indicada possível urgência. Não dependa desta pauta: procure imediatamente advogado/Defensoria ou o serviço público competente para avaliar prazos e medidas de proteção.");
      } else {
        lines.push("Se aparecer prazo contratual/judicial, ameaça, risco de perda de direitos, fraude ou conflito sobre direitos indisponíveis, busque orientação profissional antes de esperar uma reunião.");
      }
      if (willingness === "no") lines.push("Como uma parte não quer conversar, o roteiro não substitui consentimento. Considere consultar profissional sobre alternativas legítimas de notificação, mediação ou solução formal.");
      lines.push("");
      lines.push("Esta pauta é preparatória e não constitui sessão de mediação, parecer jurídico ou acordo. Pela Lei nº 13.140/2015, mediação online depende da concordância das partes e de procedimento conduzido conforme os requisitos aplicáveis.");
      latestConflictAgenda = lines.join("\n");
      conflictReportContent.replaceChildren();
      latestConflictAgenda.split("\n").forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line || " ";
        conflictReportContent.appendChild(p);
      });
      conflictReportWrap.hidden = false;
      conflictReportWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  document.getElementById("downloadConflict")?.addEventListener("click", () => {
    downloadTextFile("pauta-preparatoria-de-conversa.txt", latestConflictAgenda);
  });

});
