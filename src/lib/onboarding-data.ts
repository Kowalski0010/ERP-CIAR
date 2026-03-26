export const onboardingData: Record<
  string,
  {
    checklist: { id: string; label: string }[]
    faqs: { q: string; a: string }[]
    tutorials: { title: string; duration: string; seed: number }[]
  }
> = {
  Admin: {
    checklist: [
      { id: 'admin-1', label: 'Configurar dados da Instituição' },
      { id: 'admin-2', label: 'Personalizar Identidade Visual' },
      { id: 'admin-3', label: 'Cadastrar usuários da gestão' },
    ],
    faqs: [
      {
        q: 'Como alterar o logotipo do sistema?',
        a: 'Vá em Configurações > Identidade Visual e faça o upload do novo logotipo.',
      },
      {
        q: 'Como gerenciar acessos?',
        a: 'Acesse a aba Admin > Controle de Acesso para definir permissões.',
      },
    ],
    tutorials: [
      { title: 'Visão Geral do Painel Admin', duration: '3:45', seed: 1 },
      { title: 'Gerenciamento de Usuários', duration: '5:20', seed: 2 },
    ],
  },
  Financeiro: {
    checklist: [
      { id: 'fin-1', label: 'Revisar fluxo de caixa inicial' },
      { id: 'fin-2', label: 'Configurar integração bancária' },
      { id: 'fin-3', label: 'Validar faturas pendentes' },
    ],
    faqs: [
      {
        q: 'Como gerar um boleto avulso?',
        a: 'Acesse Financeiro > Pagamentos e clique em "Novo Boleto".',
      },
      {
        q: 'Como conciliar pagamentos?',
        a: 'Na aba de fluxo de caixa, clique em "Conciliar" ao lado da transação.',
      },
    ],
    tutorials: [
      { title: 'Gestão de Inadimplência', duration: '4:10', seed: 3 },
      { title: 'Relatórios Financeiros', duration: '6:00', seed: 4 },
    ],
  },
  Secretaria: {
    checklist: [
      { id: 'sec-1', label: 'Cadastrar nova turma' },
      { id: 'sec-2', label: 'Efetuar uma matrícula teste' },
      { id: 'sec-3', label: 'Emitir um certificado' },
    ],
    faqs: [
      {
        q: 'Como transferir um aluno de turma?',
        a: 'Acesse Secretaria > Transferências e selecione o aluno.',
      },
      { q: 'Onde imprimo os contratos?', a: 'Em Secretaria > Imprimir Documentos.' },
    ],
    tutorials: [
      { title: 'Fluxo de Matrícula', duration: '5:15', seed: 5 },
      { title: 'Gestão de Turmas', duration: '3:30', seed: 6 },
    ],
  },
  Professor: {
    checklist: [
      { id: 'prof-1', label: 'Acessar diário de classe' },
      { id: 'prof-2', label: 'Lançar plano de ensino' },
      { id: 'prof-3', label: 'Registrar frequência' },
    ],
    faqs: [
      {
        q: 'Como lançar notas?',
        a: 'Acesse Pedagógico > Controle de Notas, selecione sua turma e insira as avaliações.',
      },
      {
        q: 'Posso alterar uma falta lançada?',
        a: 'Sim, dentro do período letivo vigente, basta editar o registro na Chamada Digital.',
      },
    ],
    tutorials: [
      { title: 'Chamada Digital na Prática', duration: '2:50', seed: 7 },
      { title: 'Lançamento de Notas', duration: '4:00', seed: 8 },
    ],
  },
  Aluno: {
    checklist: [
      { id: 'alu-1', label: 'Completar dados do perfil' },
      { id: 'alu-2', label: 'Acessar quadro de horários' },
      { id: 'alu-3', label: 'Verificar biblioteca virtual' },
    ],
    faqs: [
      {
        q: 'Onde vejo minhas faltas?',
        a: 'No seu painel inicial, no card de Desempenho Acadêmico.',
      },
      {
        q: 'Como acesso os boletos?',
        a: 'Vá na aba "Extrato Financeiro" no menu lateral.',
      },
    ],
    tutorials: [{ title: 'Conhecendo o Portal do Aluno', duration: '3:10', seed: 9 }],
  },
  Responsável: {
    checklist: [
      { id: 'resp-1', label: 'Vincular conta do dependente' },
      { id: 'resp-2', label: 'Verificar boletim escolar' },
      { id: 'resp-3', label: 'Configurar alertas de faltas' },
    ],
    faqs: [
      {
        q: 'Como acompanho as notas do meu filho?',
        a: 'No Portal da Família, acesse a aba "Boletim e Notas".',
      },
    ],
    tutorials: [{ title: 'Portal da Família passo a passo', duration: '2:45', seed: 10 }],
  },
  Paciente: {
    checklist: [
      { id: 'pac-1', label: 'Preencher ficha de anamnese' },
      { id: 'pac-2', label: 'Verificar próximos agendamentos' },
      { id: 'pac-3', label: 'Acessar repositório de exames' },
    ],
    faqs: [
      {
        q: 'Como remarcar uma sessão?',
        a: 'Entre em contato com a recepção através da aba de Suporte ou telefone.',
      },
    ],
    tutorials: [{ title: 'Utilizando o Portal Clínico', duration: '3:00', seed: 11 }],
  },
  Gestao: {
    checklist: [
      { id: 'gest-1', label: 'Analisar Dashboards Principais' },
      { id: 'gest-2', label: 'Verificar Relatórios de Inadimplência' },
      { id: 'gest-3', label: 'Acompanhar Metas de Captação' },
    ],
    faqs: [
      {
        q: 'Como exporto o fluxo de caixa?',
        a: 'Acesse Financeiro > Fluxo de Caixa e clique no botão de Exportar no topo da página.',
      },
    ],
    tutorials: [{ title: 'Análise de Indicadores', duration: '4:20', seed: 12 }],
  },
  Default: {
    checklist: [
      { id: 'def-1', label: 'Explorar o painel inicial' },
      { id: 'def-2', label: 'Atualizar configurações de conta' },
    ],
    faqs: [{ q: 'Como peço ajuda?', a: 'Use a aba "Abrir Chamado" aqui mesmo no Suporte.' }],
    tutorials: [{ title: 'Visão Geral do Sistema', duration: '2:00', seed: 13 }],
  },
}
