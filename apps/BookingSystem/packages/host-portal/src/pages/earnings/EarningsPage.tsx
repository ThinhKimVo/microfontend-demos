import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Download,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../contexts/LocaleContext';
import { formatCurrency, formatDate } from '@staygcc/shared/utils';

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, currency } = useLocale();

  const [tabValue, setTabValue] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  // Mock earnings data
  const earningsSummary = {
    totalEarnings: 45230,
    pendingPayout: 8500,
    thisMonth: 12450,
    lastMonth: 10200,
    avgNightlyRate: 485,
    occupancyRate: 78,
  };

  const transactions = [
    { id: '1', date: '2024-01-15', property: 'Luxury Villa', guest: 'John Doe', amount: 2500, status: 'paid', type: 'booking' },
    { id: '2', date: '2024-01-12', property: 'Modern Apartment', guest: 'Jane Smith', amount: 1200, status: 'paid', type: 'booking' },
    { id: '3', date: '2024-01-10', property: 'Beach House', guest: 'Mike Johnson', amount: 3200, status: 'pending', type: 'booking' },
    { id: '4', date: '2024-01-08', property: 'City Studio', guest: 'Sara Williams', amount: 800, status: 'paid', type: 'booking' },
    { id: '5', date: '2024-01-05', property: 'Luxury Villa', guest: 'Tom Brown', amount: 2800, status: 'paid', type: 'booking' },
  ];

  const payouts = [
    { id: '1', date: '2024-01-01', amount: 8500, method: 'Bank Transfer', status: 'completed' },
    { id: '2', date: '2023-12-15', amount: 9200, method: 'Bank Transfer', status: 'completed' },
    { id: '3', date: '2023-12-01', amount: 7800, method: 'Bank Transfer', status: 'completed' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          {t('host:navigation.earnings')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('host:earnings.period')}</InputLabel>
            <Select
              value={selectedPeriod}
              label={t('host:earnings.period')}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="thisMonth">{t('host:earnings.thisMonth')}</MenuItem>
              <MenuItem value="lastMonth">{t('host:earnings.lastMonth')}</MenuItem>
              <MenuItem value="last3Months">{t('host:earnings.last3Months')}</MenuItem>
              <MenuItem value="thisYear">{t('host:earnings.thisYear')}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            {t('host:earnings.exportReport')}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('host:earnings.totalEarnings')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {formatCurrency(earningsSummary.totalEarnings, currency, language)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12% {t('host:earnings.fromLastPeriod')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('host:earnings.pendingPayout')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {formatCurrency(earningsSummary.pendingPayout, currency, language)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('host:earnings.nextPayout')}: Jan 31
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('host:earnings.avgNightlyRate')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {formatCurrency(earningsSummary.avgNightlyRate, currency, language)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('host:earnings.perNight')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('host:earnings.occupancyRate')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {earningsSummary.occupancyRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('host:earnings.thisMonth')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions & Payouts */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('host:earnings.transactions')} />
          <Tab label={t('host:earnings.payouts')} />
        </Tabs>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('host:earnings.date')}</TableCell>
                  <TableCell>{t('host:earnings.property')}</TableCell>
                  <TableCell>{t('host:earnings.guest')}</TableCell>
                  <TableCell align="right">{t('host:earnings.amount')}</TableCell>
                  <TableCell>{t('host:earnings.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date, 'PP', language)}</TableCell>
                    <TableCell>{transaction.property}</TableCell>
                    <TableCell>{transaction.guest}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.amount, currency, language)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={t(`host:earnings.${transaction.status}`)}
                        color={transaction.status === 'paid' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('host:earnings.date')}</TableCell>
                  <TableCell align="right">{t('host:earnings.amount')}</TableCell>
                  <TableCell>{t('host:earnings.method')}</TableCell>
                  <TableCell>{t('host:earnings.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{formatDate(payout.date, 'PP', language)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(payout.amount, currency, language)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalance fontSize="small" />
                        {payout.method}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={t(`host:earnings.${payout.status}`)}
                        color="success"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default EarningsPage;
