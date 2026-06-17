export const onlyMoney = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export const calcPotentialReturn = (value, odd) => {
  const total = onlyMoney(value) * onlyMoney(odd)
  return Number(total.toFixed(2))
}

export const sortByDateDesc = (a, b) => new Date(b.criadoEm || b.data) - new Date(a.criadoEm || a.data)
