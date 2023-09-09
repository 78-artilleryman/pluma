import React from 'react'
import styled from 'styled-components'
import Header from '../components/Header'

const LoginPage = () => {
  return (
    <Container>
     <Header></Header>
      <Content>
        <Top>
          <Logo src="../images/flumaLogo.png" alt="logo" />
          <SignUpLink href='#'>지금 가입</SignUpLink>
        </Top>
        <Mid>
         <Descriptions>
          <DescriptionTitle>소설 창작의 편리한 파트너</DescriptionTitle>
          <Description>작품을 손쉽게 기록하고 관라하세요</Description>
          <Description>소설 작가들이 작업을 더욱 편리하게 관리하고 창작에 집중할 수 있는 서비스입니다.</Description>
          <Description>작품의 가치를 높이고, 빛을 발하게 해주는 파일 관리 솔루션을 소개합니다.</Description>
         </Descriptions>
         <Descriptions>
          <DescriptionTitle>글을 쓰는 즐거움, 파일 관리의 간편함</DescriptionTitle>
          <Description>글 쓰는 과정을 더욱 즐겁게 만들며,</Description>
          <Description>파일 관리를 효율적으로 수행할 수 있도록 도움을 줍니다.</Description>
          
         </Descriptions>
         <Descriptions>
          <DescriptionTitle>작품의 AI 아트워크를 더하다</DescriptionTitle>
          <Description>작품에 독특하고 아름다운 AI 생성 이미지를 통해</Description>
          <Description>작가의 창작물을 더욱 풍부하게 만듭니다.</Description>
         </Descriptions>
        </Mid>
    
        <BGImage/>
      </Content>
    </Container>
  )
}

export default LoginPage

const Container = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
`;

const Content = styled.div`
  margin-bottom: 10vw;
  width: 100%;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 40px;
  heightL 100%;
  
`;

const Logo = styled.img`
  width: 200px;
  margin: 0 auto;
`;

const Top = styled.div`
  max-width: 650px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Mid = styled.div`
  max-width: 85%;
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SignUpLink = styled.a`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  margin: 12px auto;
  width: 50%;
  letter-spacing: 1.5px;
  font-size: 18px;
  padding: 16.5px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  text-decoration-line: none;

  &:hover{
    background-color: #0483ee;
  }
`;

const Descriptions = styled.div`
  width: 500px;
`;  

const DescriptionTitle = styled.h1`
  font-size: 25px;
  margin: 25px 0 15px 0;
  line-height: 1.5;
  letter-spacing: 1.5px;
`;

const Description = styled.p`
  font-size: 13px;
  margin: 0  0 14px;
  line-height: 1.5;
  letter-spacing: 1.5px;
`;

 const BGImage = styled.div`
  height: 100%;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url();
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
 `;