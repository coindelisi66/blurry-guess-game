import { useState, useEffect } from 'react'

interface GameScreenProps {
  rights: number
  setRights: (val: number) => void
}

interface GameData {
  image: string
  hints: string[]
  answer: string
  category?: string
}

function GameScreen({ rights, setRights }: GameScreenProps) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [revealedHints, setRevealedHints] = useState(1)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([])
  const [userName, setUserName] = useState<string>('Oyuncu')

  // Tema renkleri (butonlar ve görsel arka planları için)
  const theme = {
    from: 'from-purple-500',
    to: 'to-pink-500'
  }

  // 24 saatte bir sıfırlanan skor sistemi
  useEffect(() => {
    const savedData = localStorage.getItem('leaderboardData')
    const savedTime = localStorage.getItem('leaderboardResetTime')
    const now = Date.now()

    if (savedData && savedTime && now - Number(savedTime) < 24 * 60 * 60 * 1000) {
      setLeaderboard(JSON.parse(savedData))
    } else {
      localStorage.setItem('leaderboardData', JSON.stringify([]))
      localStorage.setItem('leaderboardResetTime', now.toString())
    }
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/guess')
      .then(res => res.json())
      .then(data => setGameData(data))
      .catch(() => setMessage('Oyun yüklenemedi, backend çalışıyor mu?'))
  }, [])

  const handleGuess = () => {
    if (!gameData) return
    if (guess.trim().toLowerCase() === gameData.answer.toLowerCase()) {
      setMessage('🎉 Tebrikler, doğru bildin!')
      setScore(prev => prev + 10)
      updateLeaderboard(10)
    } else {
      setRights(prev => prev - 1)
      setRevealedHints(prev => prev + 1)
      setMessage('❌ Yanlış tahmin!')
    }
    setGuess('')
  }

  const updateLeaderboard = (points: number) => {
    const updated = [...leaderboard]
    const existing = updated.find(l => l.name === userName)
    if (existing) existing.score += points
    else updated.push({ name: userName, score: points })

    updated.sort((a, b) => b.score - a.score)
    const top10 = updated.slice(0, 10)
    setLeaderboard(top10)
    localStorage.setItem('leaderboardData', JSON.stringify(top10))
  }

  if (!gameData)
    return (
      <div className="text-center text-gray-600 mt-8">Oyun yükleniyor...</div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sol taraf - Oyun Alanı */}
      <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
          🎬 Kim Bu Ünlü?
        </h2>

        <div className="flex justify-center mb-4">
          <img
            src={gameData.image}
            alt="guess"
            className="w-64 h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="space-y-2 mb-4">
          {gameData.hints.slice(0, revealedHints).map((hint, index) => (
            <p key={index} className="text-gray-700 flex items-center">
              <span className="mr-2">💡</span> <b>İpucu {index + 1}:</b> {hint}
            </p>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Bu ünlü kim?"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleGuess}
            className={`bg-gradient-to-r ${theme.from} ${theme.to} text-white px-4 py-2 rounded-lg font-semibold shadow-md`}
          >
            Tahmin Et ✨
          </button>
        </div>

        {message && (
          <div className="text-center text-lg font-semibold mt-3 text-gray-800">
            {message}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Kalan hak: {rights}</p>
          {rights <= 0 && (
            <button
              onClick={() => window.location.reload()}
              className={`bg-gradient-to-r ${theme.from} ${theme.to} text-white px-4 py-2 rounded-lg font-semibold shadow-md mt-3`}
            >
              🔄 Yeniden Oyna
            </button>
          )}
        </div>
      </div>

      {/* Sağ taraf - Liderlik Tablosu */}
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-purple-600 mb-4">🏆 Liderlik Tablosu</h3>
        <ul>
          {leaderboard.length === 0 && (
            <li className="text-gray-500 text-sm">Henüz kimse oynamadı.</li>
          )}
          {leaderboard.map((player, idx) => (
            <li
              key={idx}
              className={`flex justify-between py-1 px-2 rounded-md ${
                idx < 3 ? 'bg-purple-100 font-semibold' : ''
              }`}
            >
              <span>
                {idx + 1}. {player.name}
              </span>
              <span>{player.score} puan</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Her 24 saatte bir sıfırlanır ⏰
        </p>
      </div>
    </div>
  )
}

export default GameScreen
