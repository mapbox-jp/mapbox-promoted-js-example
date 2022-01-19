
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    &:before, &:after {
      box-sizing: border-box;
    }
  }
  html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
    position: relative;
    zoom: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    color: #383838;
    background: #f0f0f0;
    font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', Meiryo, メイリオ, Osaka, 'MS PGothic', 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-size: 16px;
    font-smoothing: antialiased;
    line-height: 1.6;
  }
  a {
    color: #000000;
    text-decoration: none;
  }
  ul, ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  textarea, input {
    font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', Meiryo, メイリオ, Osaka, 'MS PGothic', 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  input {
    font-size: 16px;
  }
  #app {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  #map-type-switcher, #map-extensions {
    min-width: 29px;
    min-height: 29px;
  }
  .promotion-popup {
    @media screen and (max-width: 480px) {
      zoom: 0.9;
    }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
      zoom: 1.0;      
    }
    @media screen and (min-width: 1024px) {
      zoom: 1.0;          
    }
  }
`;

export default GlobalStyle;
