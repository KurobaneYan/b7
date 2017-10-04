import React, { Component } from 'react'
import _ from 'lodash'
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'
import {
  gen1,
  gen2,
  getK,
  getM,
  getD
} from './lib'

import './App.css'

const cartesianInterpolations = [
  "basis",
  "bundle",
  "cardinal",
  "catmullRom",
  "linear",
  "monotoneX",
  "monotoneY",
  "natural",
  "step",
  "stepAfter",
  "stepBefore"
];

const polarInterpolations = [
  "basis",
  "cardinal",
  "catmullRom",
  "linear"
];

const InterpolationSelect = ({ currentValue, values, onChange }) => (
  <select onChange={onChange} value={currentValue} style={{ width: 75 }}>
    {values.map(
      (value) => <option value={value} key={value}>{value}</option>
    )}
  </select>
);

class App extends Component {
  constructor (props) {
    super(props)
    const n = 23
    const k = getK(n)
    const s = 3
    this.state = {
      interpolation: "linear",
      k,
      n,
      s,
    }
  }

  componentDidMount () {
    this.update()
  }

  update = () => {
    const { n, s } = this.state
    const g1 = gen1()
    const g2 = gen2()
    const k = getK(n)
    const k1 = []
    const k2 = []
    const a1 = []
    const a2 = []
    for (let i = 0; i < k; i++) {
      k1.push(0)
      k2.push(0)
    }
    const a11 = []
    const a12 = []
    const a21 = []
    const a22 = []
    for (let i = 0; i < n; i++) {
      const v1 = g1.next().value
      const v2 = g2.next().value
      const t1 = Math.floor(v1 * k)
      const t2 = Math.floor(v2 * k)
      // a1.push({ x: i + 1, y: v1 })
      a1.push(v1)
      k1[t1] = k1[t1] ? k1[t1] + 1 : 1
      a2.push(v2)
      k2[t2] = k2[t2] ? k2[t2] + 1 : 1

      if (i < (n - s)) {
        a11.push(v1)
        a21.push(v2)
      }

      if ((s) <= i) {
        a12.push(v1)
        a22.push(v2)
      }
    }
    const m1 = getM(a1)
    const m2 = getM(a2)

    let M1 = 0

    for (var i = 0; i < a11.length; i++) {
      for (var j = 0; j < a12.length; j++) {
        M1 += a11[i] * a12[j]
      }
    }

    M1 = M1 / a11.length / a12.length

    const r1 = (M1 - getM(a11) * getM(a12)) / Math.sqrt(getD(a11) * getD(a12))

    let M2 = 0

    for (var i = 0; i < a21.length; i++) {
      for (var j = 0; j < a22.length; j++) {
        M2 += a21[i] * a22[j]
      }
    }

    M2 = M2 / a21.length / a22.length

    const r2 = (M2 - getM(a21) * getM(a22)) / Math.sqrt(getD(a21) * getD(a22))

    const toPlot = a => a.map((v, i) => ({ x: i + 1, y: v }))
    this.setState({
      a1: toPlot(a1),
      a2: toPlot(a2),
      k,
      k1: toPlot(k1),
      k2: toPlot(k2),
      m1,
      m2,
      d1: getD(a1),
      d2: getD(a2),
      a11,
      a12,
      a21,
      a22,
      M1,
      M2,
      r1,
      r2,
    })
  }

  render () {
    const {
      interpolation,
      s,
      n,
      a1,
      a2,
      k1,
      k2,
      k,
      m1,
      m2,
      d1,
      d2,
      r1,
      r2,
    } = this.state
    return (
      <div>
        <p>
          interpolation: 
          <InterpolationSelect
            currentValue={interpolation}
            values={this.state.polar ? polarInterpolations : cartesianInterpolations }
            onChange={(event) => this.setState({ interpolation: event.target.value })}
          />
        </p>
        <p>
          n :
          <input
            value={n}
            onChange={e => this.setState({ n: e.target.value })}
          />
        </p>
        <p>
          s :
          <input
            value={s}
            onChange={e => this.setState({ s: e.target.value })}
          />
        </p>
        <p>
          k : {k}
        </p>
        
        <p>m : 0.5, d : 1/12 = 0.08(3)</p>
        <p>m1 : {m1}, d1 : {d1}, r1 : {r1}</p>
        <p>m2 : {m2}, d2 : {d2}, r2 : {r2}</p>

        <p>
          <button onClick={this.update}>
            update
          </button>
        </p>

        <div className='r'>
          <VictoryChart
            domainPadding={20}
            theme={VictoryTheme.material}
          >
            <VictoryLine
              data={a1}
              interpolation={interpolation}
              range={{ x: [0, n], y: [0, 1] }}
            />
          </VictoryChart>
          <VictoryChart
            domainPadding={20}
            theme={VictoryTheme.material}
          >
            <VictoryLine
              data={k1}
              interpolation={interpolation}
            />
          </VictoryChart>
        </div>

        <div className='r'>
          <VictoryChart
            domainPadding={20}
            theme={VictoryTheme.material}
          >
            <VictoryLine
              data={a2}
              interpolation={interpolation}
            />
          </VictoryChart>
          <VictoryChart
            domainPadding={20}
            theme={VictoryTheme.material}
          >
            <VictoryLine
              data={k2}
              interpolation={interpolation}
            />
          </VictoryChart>
        </div>
      </div>
    )
  }
}

export default App
