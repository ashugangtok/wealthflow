import React, { createContext, useContext, useState } from 'react';

const AICFOContext = createContext();

export const AICFOProvider = ({ children }) => {
  const [months, setMonths] = useState({});
  const [currentMonth, setCurrentMonth] = useState(null);
  const [documents, setDocuments] = useState({});
  const [masterLedger, setMasterLedger] = useState({});
  const [reports, setReports] = useState({});

  const addMonth = (year, month) => {
    const key = `${year}-${month}`;
    setMonths((prev) => ({
      ...prev,
      [key]: {
        id: key,
        year,
        month,
        status: 'pending_upload',
        documents: {
          bank: [],
          creditcard: [],
          salary: [],
          loans: [],
          investments: [],
          tax: [],
          insurance: [],
          other: [],
        },
        uploadedAt: null,
        processedAt: null,
        report: null,
      },
    }));
  };

  const updateMonthStatus = (monthKey, status) => {
    setMonths((prev) => ({
      ...prev,
      [monthKey]: { ...prev[monthKey], status },
    }));
  };

  const addDocumentToMonth = (monthKey, docType, file, fileData) => {
    const docKey = `${monthKey}-${docType}-${Date.now()}`;
    setDocuments((prev) => ({
      ...prev,
      [docKey]: {
        id: docKey,
        monthKey,
        type: docType,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
        status: 'uploaded',
        extractedData: fileData || null,
      },
    }));

    setMonths((prev) => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        documents: {
          ...prev[monthKey].documents,
          [docType]: [...(prev[monthKey].documents[docType] || []), docKey],
        },
      },
    }));
  };

  const addTransactionToLedger = (monthKey, transaction) => {
    setMasterLedger((prev) => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), transaction],
    }));
  };

  const saveMonthlyReport = (monthKey, report) => {
    setReports((prev) => ({
      ...prev,
      [monthKey]: report,
    }));

    setMonths((prev) => ({
      ...prev,
      [monthKey]: { ...prev[monthKey], report, status: 'complete' },
    }));
  };

  return (
    <AICFOContext.Provider
      value={{
        months,
        currentMonth,
        setCurrentMonth,
        documents,
        masterLedger,
        reports,
        addMonth,
        updateMonthStatus,
        addDocumentToMonth,
        addTransactionToLedger,
        saveMonthlyReport,
      }}
    >
      {children}
    </AICFOContext.Provider>
  );
};

export const useAICFO = () => {
  const context = useContext(AICFOContext);
  if (!context) {
    throw new Error('useAICFO must be used within AICFOProvider');
  }
  return context;
};
