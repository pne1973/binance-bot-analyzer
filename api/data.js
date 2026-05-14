// api/data.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.binance.com/api/3/ticker/24hr');
    const data = await response.json();
    
    // O servidor processa os dados antes de enviar para o seu site
    const filtered = data
      .filter(t => t.symbol.endsWith('USDC') && parseFloat(t.lastPrice) <= 0.05 && parseFloat(t.quoteVolume) > 100000)
      .map(t => ({
        symbol: t.symbol.replace('USDC', ''),
        price: parseFloat(t.lastPrice).toFixed(6),
        volume: parseFloat(t.quoteVolume),
        score: (Math.abs(parseFloat(t.priceChangePercent)) * (parseFloat(t.quoteVolume) / 1000000)).toFixed(2)
      }))
      .sort((a, b) => b.score - a.score);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Falha ao obter dados da Binance" });
  }
}
