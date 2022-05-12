import { Box, Divider, Paper, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import StockGraph from '../Graph'
import FlexBox from '../utilcomps/FlexBox'
import api from '../../api'
import { Query } from 'appwrite'
const dataSample = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]
// USER CASH
const cash = 0

const PortfolioPanel = ({ assets, stocks }) => {
  const [userCash, setUserCash] = useState(0)
  const [balance, setBalance] = useState(0)
  const [width, setWidth] = useState('100%')
  const [data, setData] = useState(dataSample)
  const graph = useRef()

  // CALCULATE PORTFOLIO VALUE
  const calculateBal = async () => {
    if (!stocks.length) return []
    let newNum = cash
    const user = await api.account.get()
    const { documents } = await api.database.listDocuments('asset', [Query.equal('ownerId', user.$id)])
    for (let i = 0; i < documents.length; i++) {
      let assetPrice = stocks.find(elem => elem.name === documents[i].stockName,)
      newNum += assetPrice.currentPrice * documents[i].shares
    }
    setBalance(newNum)
    setData(state => {
      let ar = []
      if (state.length < 100) {
        ar = state.slice(0)
      } else {
        ar = state.slice(1)
      }
      ar.push({
        "name": "Page A",
        "uv": newNum,
        "pv": newNum,
        "amt": newNum
      })
      return ar
    })
  }
  // CALL CALC PORTF VALUE EVERTIME STOCKS LISTS CHANGES
  useEffect(() => {
    calculateBal()
  }, [assets, stocks])
  // LISTEN FOR WINDOW RESIZING
  useEffect(() => {
    window.addEventListener('resize', () => {
      console.log(graph.current.offsetWidth)
      setWidth(graph.current.offsetWidth)
    })
  }, [])
  // useEffect(() => {
  //   let unsubscribe = api.subscribe()F
  // }, [])
  return (
    <>
      <Paper elevation={4} sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='body2'>Portfolio Value</Typography>
        <Typography variant='h2'>${balance.toFixed(2)}</Typography>
        <Box ref={graph}>
          <StockGraph data={data} width={width} color='#14AF7D' />
        </Box>
      </Paper>
      <FlexBox sx={{ px: 1, py: 3 }}>
        <Typography>Buying Power: </Typography>
        <Typography>${userCash}</Typography>
      </FlexBox>
      <Divider sx={{ flex: '100% 1 1' }} />

    </>
  )
}

export default PortfolioPanel