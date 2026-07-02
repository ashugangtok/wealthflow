import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const UploadCenter = () => {
  const { currentMonth, months, addDocumentToMonth, updateMonthStatus } = useAICFO();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRefs = useRef({});

  const month = currentMonth ? months[currentMonth] : null;

  const documentTypes = [
    { type: 'bank', label: 'Bank Statements', icon: '🏦', color: '#06b6d4' },
    { type: 'creditcard', label: 'Credit Cards', icon: '💳', color: '#ef4444' },
    { type: 'salary', label: 'Salary Slips', icon: '💰', color: '#10b981' },
    { type: 'loans', label: 'Loan Statements', icon: '📊', color: '#f59e0b' },
    { type: 'investments', label: 'Investment Statements', icon: '📈', color: '#8b5cf6' },
    { type: 'tax', label: 'Tax Documents', icon: '📄', color: '#ec4899' },
    { type: 'insurance', label: 'Insurance', icon: '🛡️', color: '#14b8a6' },
    { type: 'other', label: 'Other Documents', icon: '📁', color: '#6b7280' },
  ];

  const handleFileUpload = async (e, docType) => {
    const files = Array.from(e.target.files);
    if (!files.length || !month) return;

    setUploading(true);
    updateMonthStatus(currentMonth, 'processing');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));

      // Simulate upload and AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addDocumentToMonth(currentMonth, docType, file, {
        fileName: file.name,
        uploadedAt: new Date(),
        status: 'processing',
      });
    }

    setUploading(false);
    setUploadProgress(0);
    updateMonthStatus(currentMonth, 'complete');
  };

  if (!month) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Please select a month from the Financial Timeline to upload documents.
      </Alert>
    );
  }

  const uploadedDocs = month.documents || {};

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Upload Center
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>

      {uploading && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Uploading and processing documents... {uploadProgress}%
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* Document Types */}
      <Grid container spacing={2}>
        {documentTypes.map((doc) => {
          const docCount = uploadedDocs[doc.type]?.length || 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={doc.type}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${doc.color}15 0%, ${doc.color}05 100%)`,
                    p: 3,
                    textAlign: 'center',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: doc.color,
                  }}
                  onClick={() => fileInputRefs.current[doc.type]?.click()}
                >
                  <Typography sx={{ fontSize: 40, mb: 1 }}>{doc.icon}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {doc.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 2 }}>
                    {docCount} file{docCount !== 1 ? 's' : ''} uploaded
                  </Typography>

                  {docCount > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 1 }}>
                      {Array(Math.min(docCount, 3))
                        .fill(0)
                        .map((_, i) => (
                          <CheckCircleIcon key={i} sx={{ fontSize: 16, color: doc.color }} />
                        ))}
                      {docCount > 3 && (
                        <Typography variant="caption" sx={{ color: doc.color, fontWeight: 600 }}>
                          +{docCount - 3}
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 1, borderColor: doc.color, color: doc.color }}
                    disabled={uploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs.current[doc.type]?.click();
                    }}
                  >
                    {docCount > 0 ? 'Add More' : 'Upload'}
                  </Button>

                  <input
                    ref={(el) => {
                      if (el) fileInputRefs.current[doc.type] = el;
                    }}
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, doc.type)}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </Box>

                {/* Uploaded Files List */}
                {docCount > 0 && (
                  <CardContent sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <List sx={{ p: 0 }}>
                      {uploadedDocs[doc.type].map((docId, index) => (
                        <ListItem key={docId} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={`Document ${index + 1}`}
                            primaryTypographyProps={{ variant: 'caption', sx: { fontWeight: 600 } }}
                          />
                          <IconButton size="small" color="error">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Processing Info */}
      <Card sx={{ mt: 4, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            🤖 AI Processing
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Once documents are uploaded, our AI will automatically:
          </Typography>
          <Typography variant="caption" component="div" color="textSecondary" sx={{ mt: 1.5, ml: 2 }}>
            ✓ Read and extract text from PDFs<br />
            ✓ Identify transaction details<br />
            ✓ Categorize expenses automatically<br />
            ✓ Detect duplicates and transfers<br />
            ✓ Create a unified master ledger<br />
            ✓ Generate monthly financial report
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadCenter;
