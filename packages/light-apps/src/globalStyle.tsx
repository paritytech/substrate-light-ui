import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  #root {
    color: #4e4e4e;
    font-family: sans-serif;
    height: 100%;
    width: 100%;
  }

  h1, h2, h3, h4, h5 {
    color: rgba(0, 0, 0, .6);
    font-weight: 100;
  }

  h1 {
    text-transform: lowercase;
  }

  h3, h4, h5 {
    margin-bottom: 0.25rem;
  }

  main {
    padding: 1em 2em;
    min-height: 100vh;
  }

  main > section {
    margin-bottom: 2em;
  }

  article {
    background: white;
    border: 1px solid #f2f2f2;
    border-left-width: 0.25rem;
    border-radius: 0.25rem;
    margin: 0.5rem;
    padding: 1rem 1.5rem;

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
      color: #9f3a38;
    }

    &.warning {
      background: #ffffe0;
      border-color: #eeeeae;
    }
  }

  header,
  summary {
    margin-bottom: 2em;
    text-align: center;
  }

  header+header,
  header+summary,
  summary+header {
    margin-top: -1em;
  }

  summary {
    align-items: stretch;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  summary article {
    color: rgba(0, 0, 0, 0.6);
    flex: 0 1 auto;
    text-align: left;
  }

  summary > section {
    display: flex;
    flex: 0 1 auto;
    text-align: left;
  }

  .apps--App {
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    min-height: 100vh;

    .apps--Content,
    .apps--SideBar {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .apps--Content {
      background: #fafafa;
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
`;
