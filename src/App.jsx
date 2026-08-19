import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  Paper,
  IconButton
} from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#90caf9',
    },
    error: {
      main: '#f44336',
    }
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  }
});

export default function TelaPerfil() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <Container maxWidth="sm" sx={{ minHeight: '100vh', pb: 4 }}>
        
        {/* AppBar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
          <IconButton edge="start" color="inherit">
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            PERFIL
          </Typography>
          <Button color="inherit" endIcon={<LogoutIcon />}>
            Sair
          </Button>
        </Box>

        {/* Informações Pessoais */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', color: '#000', fontSize: '2rem' }}>
              O
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">Nome Completo</Typography>
              <Typography variant="body2" color="text.secondary">usuario@email.com</Typography>
              <Typography variant="body2" color="text.secondary">+55 55 99999-9999</Typography>
            </Box>
          </Box>
          <Button variant="outlined" fullWidth sx={{ mt: 3, borderRadius: 2 }}>
            Editar Informações
          </Button>
        </Paper>

        {/* Segurança */}
        <Typography variant="overline" color="text.secondary" sx={{ ml: 2 }}>
          SEGURANÇA
        </Typography>
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            <ListItemButton divider>
              <ListItemText primary="Alterar Senha de Acesso" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="PIN de Transação" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Habilitar Biometria" />
              <Switch edge="end" defaultChecked />
            </ListItemButton>
          </List>
        </Paper>

        {/* Preferências */}
        <Typography variant="overline" color="text.secondary" sx={{ ml: 2 }}>
          PREFERÊNCIAS
        </Typography>
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            <ListItemButton divider>
              <ListItemText primary="Moeda Padrão (BRL - R$)" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Gerenciar Contas e Cartões" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Notificações de Gastos" />
              <Switch edge="end" defaultChecked />
            </ListItemButton>
          </List>
        </Paper>

        {/* Dados e Suporte */}
        <Typography variant="overline" color="text.secondary" sx={{ ml: 2 }}>
          DADOS E SUPORTE
        </Typography>
        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            <ListItemButton divider>
              <ListItemText primary="Exportar Dados (CSV/Excel)" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Central de Ajuda" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Termos de Uso e Privacidade" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Ações Destrutivas */}
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth 
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', borderWidth: 2 }}
        >
          Excluir Minha Conta
        </Button>

      </Container>
    </ThemeProvider>
  );
}