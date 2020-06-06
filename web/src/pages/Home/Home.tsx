import React from 'react'
import styled from 'styled-components'
import { config } from 'react-awesome-styled-grid'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import backgroundImage from '../../assets/home-background.svg';
import logo from '../../assets/logo.svg';

interface HomeProps {
  className?: string
}

const Home: React.FC<HomeProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className='content'>
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>
        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <Link to="/cadastro">
            <span>
              <FiLogIn />
            </span>
            <strong>
              Cadastre um ponto de coleta
            </strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default styled(Home)`
  height: 100vh;
  background: url(${backgroundImage}) no-repeat 700px bottom;

  .content {
    width: 100%;
    height: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 30px;

    display: flex;
    flex-direction: column;

    align-items: center;
      text-align: center;
  }

  .content header {
      margin: 48px auto 0;
  }

  .content main {
    flex: 1;
    max-width: 560px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content main h1 {
    font-size: 42px;
    color: var(--title-color);
  }

  .content main p {
    font-size: 24px;
    margin-top: 24px;
    line-height: 38px;
  }

  .content main a {
    width: 100%;
    max-width: 360px;
    height: 72px;
    background: var(--primary-color);
    border-radius: 8px;
    text-decoration: none;

    display: flex;
    align-items: center;
    overflow: hidden;

    margin-top: 40px;
  }

  .content main a span {
    display: block;
    background: rgba(0, 0, 0, 0.08);
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .content main a span svg {
    color: #FFF;
    width: 20px;
    height: 20px;
  }

  .content main a strong {
    flex: 1;
    text-align: center;
    color: #FFF;
  }

  .content main a:hover {
    background: #2FB86E;
  }

  ${(props) => config(props).media.sm`
    .content {
      align-items: flex-start;
    }

    .content header {
      margin: 48px 0 0;
    }

    .content main {
        align-items: start;
    }

    .content main h1 {
      font-size: 54px;
    }
  `}

`
