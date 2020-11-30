import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  spacing: 16,
  palette: {
    primary: '',
    secondary: '',
    error: '',
    offWhite: '#EFEEEE',
    fontPrimary: '',
    background: '#92DFF3',
  },
  typography: {
    title: '',
  },
};

export const darkTheme: DefaultTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
  },
};
