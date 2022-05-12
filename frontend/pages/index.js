import Head from 'next/head'
import { Container, Paper } from '@mui/material'
import PortfolioPanel from '../components/PanelPortfolio/PortfolioPanel'
import MarketPanel from '../components/PanelMarket/MarketPanel'
import ActionPanel from '../components/ActionPanel'
import { useEffect, useState } from 'react'
import api from '../api'
import { Query } from 'appwrite'

export default function Home() {
  const [open, setOpen] = useState(false)
  const [focuseStock, setFocuseStock] = useState()
  const [assets, setAssets] = useState([])
  const [stocks, setStocks] = useState([])
  const [user, setUser] = useState()

  const fetchStocksAndAssets = async () => {
    try {
      const user = await api.account.get()
      const { documents: dataFromServerAssets } = await api.database.listDocuments('asset', [Query.equal('ownerId', user.$id)])
      const { documents: dataFromServerStocks } = await api.database.listDocuments('stock')
      setAssets(dataFromServerAssets)
      setStocks(dataFromServerStocks)
    } catch (e) {
      console.log(e)
    }

  }
  const handleChangeFocus = (stock) => {
    // console.log(stock)
    setOpen(true)
    setFocuseStock(stock)
  }
  // FETCH USER INFO
  const fetchUser = async () => {
    try {
      let user = await api.account.get()
      setUser(user)
    } catch (e) {
      console.log(e)
    }
  }
  // FETCH STOCK PRICE EVERY 10 SECOND
  useEffect(() => {
    let interval
    if (stocks) {
      interval = setInterval(async () => {
        const { documents: dataFromServerStocks } = await api.database.listDocuments('stock')
        setStocks(dataFromServerStocks)
      }, 10000)
    }
    return () => clearInterval(interval)
  }, [])
  // FETCH STOCK AND ASSET LIST ON LOAD
  useEffect(() => {
    fetchStocksAndAssets()
  }, [])
  // FETCH USER INFO
  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <Container maxWidth='xl'>
      <Head>
        <title>Trading Sim</title>
        <meta name="description" content="Stock Simulator" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <>
        <Paper sx={{ p: 2, backdropFilter: 'blur(20px)' }}>
          <PortfolioPanel user={user} stocks={stocks} assets={assets} />
          <MarketPanel stocks={stocks} setFocuseStock={handleChangeFocus} />
        </Paper>
        {focuseStock &&
          <ActionPanel open={open} setOpen={setOpen} stockId={focuseStock.$id} />
        }
      </>
    </Container>
  )
}
