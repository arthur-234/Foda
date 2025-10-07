export function clearAllData() {
  // Lista de todas as chaves do localStorage usadas na aplicação
  const keys = [
    'expenses',
    'investments', 
    'profits'
  ]
  
  // Remove cada chave do localStorage
  keys.forEach(key => {
    localStorage.removeItem(key)
  })
  
  console.log('Todos os dados foram limpos do localStorage')
}

export function clearExpenses() {
  localStorage.removeItem('expenses')
  console.log('Dados de gastos foram limpos')
}

export function clearInvestments() {
  localStorage.removeItem('investments')
  console.log('Dados de investimentos foram limpos')
}

export function clearProfits() {
  localStorage.removeItem('profits')
  console.log('Dados de lucros foram limpos')
}