import styled from 'styled-components';

export const html = styled.html`
  height: 100%;
`;

export const body = styled.body`
  height: 100%;
  margin: 0;
`;

export const root = styled.body`
  color: #4e4e4e;
  font-family: sans-serif;
  height: 100%;
`;

export const main = styled.main`
  padding: 1em 2em;
  min-height: 100vh;

  section {
    margin-bottom: 2em;
  }
`;

export const article = styled.article`
  background: white;
  border: 1px solid #f2f2f2;
  border-left-width: 0.25rem;
  border-radius: 0.25rem;
  /* border-top-width: 1px; */
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
`;

export const summary = styled.summary`
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & ~ article {
    color: rgba(0, 0, 0, 0.6);
    flex: 0 1 auto;
    text-align: left;
  }

  section {
    display: flex;
    flex: 0 1 auto;
    text-align: left;
  }
`;
