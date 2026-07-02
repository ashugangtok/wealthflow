import React from 'react';
import { Box, Card, CardContent, Grid, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useAICFO } from '../../../context/AICFOContext';

const DocumentVault = () => {
  const { months, documents } = useAICFO();

  const docsByYear = {};
  Object.values(documents).forEach((doc) => {
    if (!docsByYear[doc.monthKey]) {
      docsByYear[doc.monthKey] = [];
    }
    docsByYear[doc.monthKey].push(doc);
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Document Vault
      </Typography>

      {Object.keys(docsByYear).length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No documents uploaded yet. Upload statements to populate this vault.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(docsByYear).map(([monthKey, docs]) => {
            const month = months[monthKey];
            if (!month) return null;

            return (
              <Grid item xs={12} md={6} key={monthKey}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      {new Date(month.year, month.month - 1).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {docs.map((doc) => (
                        <ListItem key={doc.id} secondaryAction={<IconButton edge="end" size="small">
                          <DownloadIcon sx={{ fontSize: 16 }} />
                        </IconButton>}>
                          <ListItemText
                            primary={doc.fileName}
                            secondary={`${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default DocumentVault;
