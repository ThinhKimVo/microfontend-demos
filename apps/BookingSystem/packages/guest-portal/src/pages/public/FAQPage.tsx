import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore,
  Search,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setExpandedPanel(false);
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const guestFAQs = [
    {
      id: 'g1',
      question: t('common:faq.guest.q1.question'),
      answer: t('common:faq.guest.q1.answer'),
    },
    {
      id: 'g2',
      question: t('common:faq.guest.q2.question'),
      answer: t('common:faq.guest.q2.answer'),
    },
    {
      id: 'g3',
      question: t('common:faq.guest.q3.question'),
      answer: t('common:faq.guest.q3.answer'),
    },
    {
      id: 'g4',
      question: t('common:faq.guest.q4.question'),
      answer: t('common:faq.guest.q4.answer'),
    },
    {
      id: 'g5',
      question: t('common:faq.guest.q5.question'),
      answer: t('common:faq.guest.q5.answer'),
    },
    {
      id: 'g6',
      question: t('common:faq.guest.q6.question'),
      answer: t('common:faq.guest.q6.answer'),
    },
  ];

  const hostFAQs = [
    {
      id: 'h1',
      question: t('common:faq.host.q1.question'),
      answer: t('common:faq.host.q1.answer'),
    },
    {
      id: 'h2',
      question: t('common:faq.host.q2.question'),
      answer: t('common:faq.host.q2.answer'),
    },
    {
      id: 'h3',
      question: t('common:faq.host.q3.question'),
      answer: t('common:faq.host.q3.answer'),
    },
    {
      id: 'h4',
      question: t('common:faq.host.q4.question'),
      answer: t('common:faq.host.q4.answer'),
    },
    {
      id: 'h5',
      question: t('common:faq.host.q5.question'),
      answer: t('common:faq.host.q5.answer'),
    },
  ];

  const paymentFAQs = [
    {
      id: 'p1',
      question: t('common:faq.payment.q1.question'),
      answer: t('common:faq.payment.q1.answer'),
    },
    {
      id: 'p2',
      question: t('common:faq.payment.q2.question'),
      answer: t('common:faq.payment.q2.answer'),
    },
    {
      id: 'p3',
      question: t('common:faq.payment.q3.question'),
      answer: t('common:faq.payment.q3.answer'),
    },
    {
      id: 'p4',
      question: t('common:faq.payment.q4.question'),
      answer: t('common:faq.payment.q4.answer'),
    },
  ];

  const filterFAQs = (faqs: typeof guestFAQs) => {
    if (!searchQuery) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  };

  const renderFAQs = (faqs: typeof guestFAQs) => {
    const filtered = filterFAQs(faqs);
    if (filtered.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('common:faq.noResults')}
        </Typography>
      );
    }
    return filtered.map((faq) => (
      <Accordion
        key={faq.id}
        expanded={expandedPanel === faq.id}
        onChange={handleAccordionChange(faq.id)}
        sx={{
          mb: 1,
          '&:before': { display: 'none' },
          borderRadius: 2,
          '&.Mui-expanded': {
            margin: '0 0 8px 0',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              my: 2,
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            {faq.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {faq.answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          backgroundColor: 'primary.main',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{ color: 'white', mb: 2 }}
          >
            {t('common:faq.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, mb: 4 }}
          >
            {t('common:faq.subtitle')}
          </Typography>
          <TextField
            fullWidth
            placeholder={t('common:faq.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 500,
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      {/* FAQ Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              },
            }}
          >
            <Tab label={t('common:faq.tabs.guests')} />
            <Tab label={t('common:faq.tabs.hosts')} />
            <Tab label={t('common:faq.tabs.payments')} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderFAQs(guestFAQs)}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderFAQs(hostFAQs)}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderFAQs(paymentFAQs)}
        </TabPanel>
      </Container>

      {/* Contact CTA */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {t('common:faq.stillHaveQuestions')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('common:faq.contactUs')}
          </Typography>
          <Typography variant="body1" color="primary.main" fontWeight={500}>
            support@staygcc.com
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default FAQPage;
