import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useAccount, useConnect, useSendTransaction } from 'wagmi'
import { base } from 'wagmi/chains'
import { parseUnits } from 'viem'
import { USDC_ADDRESS, APP_WALLET } from './constants'
import GameScreen from './components/GameScreen'

function App() {
  const [userFid, setUserFid] = useState<number | null>(null)
  const [rights, setRights] = useState(20)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendTransaction } = useSendTransaction()

  useEffect(() => {
    const init = async () => {
      try {
        // SDK mevcut mu kontrol et
        if (!sdk?.actions || !sdk?.session) {
          console.warn('SDK hazır değil, sahte FID atanıyor (yerel test modu).')
          setUserFid(12345) // 💡 Yerel test için fake FID
          return
        }

        // SDK'yı başlat
        sdk.actions.ready()

        // Farcaster session bilgisini al
        const session = await sdk.session.get().catch(() => null)
        if (session?.fid) {
          console.log('Gerçek FID bulundu:', session.fid)
          setUserFid(session.fid)
        } else {
          console.warn('FID alınamadı, sahte FID atanıyor.')
          setUserFid(12345) // 💡 Yerel test için fake FID
        }
      } catch (err) {
        console.error('SDK başlatma hatası:', err)
        setUserFid(12345) // 💡 Hata durumunda da fake FID
      }
    }

    init()
  }, [])

  const payForRights = async () => {
    if (!address) return alert('Cüzdan bağla!')

    const amount = parseUnits('0.5', 6)
    const calldata = `0xa9059cbb${APP_WALLET.slice(2).padStart(64, '0')}${amount.toString(16).padStart(64, '0')}`

    try {
      await sendTransaction({
        to: USDC_ADDRESS,
        data: calldata,
        chainId: base.id,
      })
      setRights(prev => prev + 20)
      alert('Ödeme başarılı! 20 hak eklendi.')
    } catch (err) {
      console.error('Ödeme hatası:', err)
      alert('Ödeme başarısız.')
    }
  }

  // Eğer FID yoksa "Yükleniyor..." göster
  if (!userFid) {
    return (
      <div className="p-8 text-center text-lg text-gray-600">
        Yükleniyor...
      </div>
    )
  }

  // Uygulama arayüzü
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">
          Blurry Guess
        </h1>
        <p className="text-center text-gray-600 mb-4">FID: {userFid}</p>
        <div className="bg-gray-100 rounded-xl p-3 text-center mb-6">
          <span className="text-2xl font-bold text-purple-600">{rights}</span> Hak
        </div>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold"
          >
            Cüzdanı Bağla
          </button>
        ) : (
          <>
            <GameScreen rights={rights} setRights={setRights} />
            {rights <= 0 && (
              <button
                onClick={payForRights}
                className="w-full mt-4 bg-green-500 text-white py-3 rounded-xl font-bold"
              >
                +20 Hak → 0.5 USDC (+ETH fee)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
