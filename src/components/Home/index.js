import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import Row from '../Row'
import Col from '../Col'

const Button = styled(ButtonComponent)`
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  font-size: 2rem;
`

const Home = ({ onChooseFolderClick, onLoadClick }) =>
  <Wrapper>
    <ViewHeader>Welcome</ViewHeader>
    <Content>
      <p>Hello! Let's get started...</p>
      <Row align='stretch'>
        <Col>
          <Button size='large' onClick={onLoadClick}>Load Existing Project</Button>
        </Col>
        <Col>
          <Button size='large' onClick={onChooseFolderClick}>Choose Sketch Folder</Button>
        </Col>
      </Row>
    </Content>
  </Wrapper>

Home.propTypes = {
  onChooseFolderClick: PropTypes.func.isRequired,
  onLoadClick: PropTypes.func.isRequired,
}

export default Home
