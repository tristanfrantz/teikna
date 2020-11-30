import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: number;
    palette: {
      primary: string;
      secondary: string;
      error: string;
      offWhite: string;
      fontPrimary: string;
      background: string;
    };
    typography: {
      title: string;
    };
  }
}
