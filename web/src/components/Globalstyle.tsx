import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --primary-color: #34CB79;
    --title-color: #322153;
    --text-color: #6C6C80;
  }
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    background: #F0F0F5;
    -webkit-font-smoothing: antialiased;
    color: var(--text-color);
  }

  body, input, button {
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--title-color);
    font-family: Ubuntu;
  }
`;
