import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useCreditCards } from '../../context/CreditCardsContext';
import { uploadStatement, getAllStatements, deleteStatement, analyzeStatement } from '../../utils/firebaseHelpers';

const StatementUpload = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { accounts: bankAccounts } = useBankAccounts();
  const { cards: creditCards } = useCreditCards();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openAnalysisDialog, setOpenAnalysisDialog] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    accountType: '',
    accountName: '',
    month: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchStatements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStatements = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllStatements(user.uid);
      setStatements(data);
    } catch (err) {
      console.error('Failed to load statements:', err);
      addNotification('Failed to load statements', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only PDF, CSV, and Excel files are supported');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !formData.accountType || !formData.accountName) {
      setError('Please fill in all fields and select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileName = `${formData.accountType}_${formData.accountName}_${formData.month.split('-')[1]}-${formData.month.split('-')[0]}_${Date.now()}.${file.name.split('.').pop()}`;

      await uploadStatement(user.uid, file, fileName, {
        accountType: formData.accountType,
        accountName: formData.accountName,
        month: formData.month,
        fileName: fileName,
        uploadedAt: new Date(),
        fileSize: file.size,
      });

      addNotification('✅ Statement uploaded successfully', 'success', 3000);
      setFormData({ accountType: '', accountName: '', month: new Date().toISOString().split('T')[0] });
      setFile(null);
      setOpenUploadDialog(false);
      await fetchStatements();
    } catch (err) {
      setError(err.message || 'Failed to upload statement');
      addNotification(err.message || 'Failed to upload statement', 'error', 4000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAnalyze = async (statement) => {
    setSelectedStatement(statement);
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await analyzeStatement(user.uid, statement);
      setAnalysis(result);
      setOpenAnalysisDialog(true);
    } catch (err) {
      addNotification(err.message || 'Failed to analyze statement', 'error', 4000);
      setSelectedStatement(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (statementId) => {
    if (!window.confirm('Are you sure you want to delete this statement?')) return;

    try {
      await deleteStatement(user.uid, statementId);
      setStatements(statements.filter((s) => s.id !== statementId));
      addNotification('Statement deleted', 'info', 3000);
    } catch (err) {
      addNotification('Failed to delete statement', 'error', 3000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Account Statements
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Upload and analyze your monthly bank & credit card statements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setOpenUploadDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Upload Statement
        </Button>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Upload Monthly Statement</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            select
            label="Account Type"
            value={formData.accountType}
            onChange={(e) => {
              setFormData({ ...formData, accountType: e.target.value, accountName: '' });
              setError('');
            }}
            margin="normal"
          >
            <MenuItem value="bank">Bank Account</MenuItem>
            <MenuItem value="creditcard">Credit Card</MenuItem>
            <MenuItem value="investment">Investment Account</MenuItem>
            <MenuItem value="loan">Loan/Liability</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Account Name"
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            margin="normal"
            disabled={!formData.accountType}
          >
            {formData.accountType === 'bank' && bankAccounts.map((account) => (
              <MenuItem key={account.id} value={account.accountName || account.name}>
                {account.accountName || account.name}
              </MenuItem>
            ))}
            {formData.accountType === 'creditcard' && creditCards.map((card) => (
              <MenuItem key={card.id} value={card.cardName}>
                {card.cardName}
              </MenuItem>
            ))}
            {formData.accountType === 'investment' && (
              <MenuItem value="Investment Portfolio">Investment Portfolio</MenuItem>
            )}
            {formData.accountType === 'loan' && (
              <MenuItem value="Loan Account">Loan Account</MenuItem>
            )}
          </TextField>

          <TextField
            fullWidth
            label="Statement Month"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mt: 3, p: 2, border: '2px dashed #cbd5e1', borderRadius: 1, textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' }} component="label">
            <CloudUploadIcon sx={{ fontSize: 40, color: '#64748b', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {file ? `Selected: ${file.name}` : 'Click to upload or drag & drop'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PDF, CSV, or Excel (Max 10MB)
            </Typography>
            <input type="file" onChange={handleFileSelect} accept=".pdf,.csv,.xls,.xlsx" hidden />
          </Box>

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenUploadDialog(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading || !file}
            sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={openAnalysisDialog} onClose={() => setOpenAnalysisDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          AI Analysis - {selectedStatement?.accountName}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {analyzing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Analyzing statement with AI...</Typography>
            </Box>
          ) : analysis ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📊 Key Insights
              </Typography>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #0891b2' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#0369a1', fontWeight: 500 }}>
                  {analysis.insights}
                </Typography>
              </Box>

              {analysis.spending_patterns && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    💰 Spending Patterns
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#fef3c7', borderRadius: 1, border: '1px solid #f59e0b' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#92400e', fontWeight: 500 }}>
                      {analysis.spending_patterns}
                    </Typography>
                  </Box>
                </>
              )}

              {analysis.recommendations && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    💡 Recommendations
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#dcfce7', borderRadius: 1, border: '1px solid #10b981' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#15803d', fontWeight: 500 }}>
                      {analysis.recommendations}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Typography color="textSecondary">No analysis available</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAnalysisDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Statements List */}
      {statements.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Box sx={{ fontSize: 64, mb: 2 }}>📄</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Statements Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Upload your monthly bank and credit card statements to get AI-powered financial insights.
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            Upload Your First Statement
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {statements.map((statement) => (
            <Grid item xs={12} sm={6} md={4} key={statement.id}>
              <Card sx={{ p: 2.5, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {statement.accountName}
                    </Typography>
                    <Chip
                      label={statement.accountType}
                      size="small"
                      sx={{ mt: 0.5, backgroundColor: '#dbeafe', color: '#0369a1', fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ color: 'textSecondary', display: 'block', mb: 1 }}>
                  Month: {new Date(statement.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
                <Typography variant="caption" sx={{ color: 'textSecondary', display: 'block', mb: 2 }}>
                  Uploaded: {new Date(statement.uploadedAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleAnalyze(statement)}
                    disabled={analyzing && selectedStatement?.id === statement.id}
                    sx={{ flex: 1, textTransform: 'none' }}
                  >
                    {analyzing && selectedStatement?.id === statement.id ? 'Analyzing...' : 'Analyze'}
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(statement.id)}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatementUpload;
