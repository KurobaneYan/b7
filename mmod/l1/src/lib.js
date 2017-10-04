// const M = 676171
// const N = 100

function * gen1 (seed = 1994) {
  // let seed = 1994
  while (true) {
    let sqr = seed ** 2
    let str = String(sqr)
    if (str.length < 8) {
      for (let i = 0; i < 8 - str.length; i++) {
        str = '0' + str
      }
    }
    seed = parseInt(str.slice(2, 6), 10)
    if (seed < 1000) {
      seed += 1000
    }
    yield (seed - 1000) / 8999
  }
}

function * gen2 (A = 1994, k = 271129, M = 676171) {
  // let A = 1994
  // const k = 271129
  while (true) {
    A = (A * k) % M
    yield A / M
  }
}

const getK = N => 1 + Math.floor(Math.log2(N))

const getM = a => a.reduce((a, i) => a + i, 0) / a.length

const getD = a => a.reduce((acc, i) => acc + (i ** 2 - getM(a) ** 2), 0) / a.length

export { gen1, gen2, getK, getM, getD }
