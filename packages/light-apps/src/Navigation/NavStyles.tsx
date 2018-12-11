/* Copyright 2017-2018 @polkadot/light-apps authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import styled from 'styled-components';

export const NavStyles = styled.div`

  .apps--TopNav.menu {
    margin-bottom: 0;
  }

  #toggleSideNav {
    position: absolute;
    top: 1.4rem;
    left: 1.9rem;
    z-index: 100;
  }

  .apps--SideBar {
    background: #ffffff;
    text-align: left;
    overflow: visible;
    margin-top: 0;
  }

  .apps--SideBar-Pusher > div {
    padding: 0;
    border: 0;
  }

  .apps--SideBar-github {
    position: absolute;
    bottom: 1.5em;
    left: 1.5em;
  }

  .apps--SideBar-logo {
    width: 100%;
    margin: .5rem 1.5rem 1.5rem .75rem;
    width: 10rem;
  }

  .apps--SideBar-logo.closed {
    margin: .5rem 1.5rem 1.5rem 3.75rem;
  }

  .apps--SideBar-Item {
    overflow-x: visible;
    text-align: right;

    .apps--SideBar-Item-NavLink {
      color: black;
      display: block;
      padding: 0.75em 0.75em;
      white-space: nowrap;

      .apps--SideBar-Item-NavLink-active {
        background: #fafafa;
        border-radius: 0.28571429rem 0 0 0.28571429rem;
        color: inherit;

        &:hover {
          color: inherit;
        }
      }
    }
  }
`;
