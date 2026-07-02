import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, Typography } from '@mui/material';
import { AICFOProvider } from '../../context/AICFOContext';
import AICFOOverview from './pages/AICFOOverview';
import FinancialTimeline from './pages/FinancialTimeline';
import UploadCenter from './pages/UploadCenter';
import MonthlyReports from './pages/MonthlyReports';
import CompareMonths from './pages/CompareMonths';
import AIInsights from './pages/AIInsights';
import FinancialHealth from './pages/FinancialHealth';
import AIChat from './pages/AIChat';
import DocumentVault from './pages/DocumentVault';
import AICFOSettings from './pages/AICFOSettings';

const AICFOContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Overview', component: AICFOOverview },
    { label: 'Financial Timeline', component: FinancialTimeline },
    { label: 'Upload Center', component: UploadCenter },
    { label: 'Monthly Reports', component: MonthlyReports },
    { label: 'Compare Months', component: CompareMonths },
    { label: 'AI Insights', component: AIInsights },
    { label: 'Financial Health', component: FinancialHealth },
    { label: 'AI Chat', component: AIChat },
    { label: 'Documents', component: DocumentVault },
    { label: 'Settings', component: AICFOSettings },
  ];

  const TabComponent = tabs[activeTab]?.component || AICFOOverview;

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            ✨ AI CFO
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Intelligent financial analysis and insights powered by AI
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                minWidth: 'auto',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ py: 2 }}>
          <TabComponent />
        </Box>
      </Container>
    </Box>
  );
};

const AICFO = () => {
  return (
    <AICFOProvider>
      <AICFOContent />
    </AICFOProvider>
  );
};

export default AICFO;
