import React from 'react'
import styled from 'styled-components'

const Header = () => {
  return (
  <Nav>
    <a href='#'>
      <Logo src="./images/flumaLogo2.png" alt="logo" />
    </a>
    <LoginButton>Login</LoginButton>
  </Nav>
  )
}

export default Header

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  padding: 10px;
`

const Logo = styled.img`
  width: 150px;
`;

const LoginButton = styled.button`
  font-size: 15px;
  width: 100px;
  background-color: #0063e5;
  border: none;
  color: white;
  border-radius: 4px;

  &:hover{
    background-color: #0483ee;
  }
`;
