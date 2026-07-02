const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple statement analysis endpoint
// In production, this would call Claude API with actual statement data
app.post('/api/analyze-statement', async (req, res) => {
  try {
    const { prompt, statementId, userId } = req.body;

    // Simulated AI analysis response
    // In production, call Claude API here
    const analysis = {
      insights: `📊 Statement Analysis for ${new Date().toLocaleDateString()}:\n\n• Total transactions processed\n• Average transaction value identified\n• Key spending areas detected\n• Regular recurring transactions found\n• Unusual activities flagged for review`,
      spending_patterns: `💰 Spending Breakdown:\n\n• Essential expenses: ~40-45%\n• Discretionary spending: ~30-35%\n• Savings/Investments: ~20-25%\n• Monthly trend: Relatively stable with seasonal variations\n• Peak spending days identified`,
      recommendations: `💡 Actionable Recommendations:\n\n1. Set up automatic transfers to savings (recommended: 20% of income)\n2. Review discretionary spending - potential to save ₹500-1000/month\n3. Consider consolidating subscriptions\n4. Monitor credit card utilization - aim to keep below 30%\n5. Set up budget alerts for major categories`,
    };

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze statement' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Statement Analysis API running on port ${PORT}`);
});
