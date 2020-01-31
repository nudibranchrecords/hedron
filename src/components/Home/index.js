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
  text-align: center;

  h3 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }
`

const Home = ({ onChooseFolderClick, onLoadClick }) =>
  <Wrapper>
    <ViewHeader>Welcome</ViewHeader>
    <Content>
      <h3>Hello! Let's get started...</h3>
      <p>Either select your parent "sketches" folder or load in a saved .json file.</p>
      <Row align='stretch'>
        <Col>
          <Button size='large' onClick={onLoadClick}>Load Existing Project</Button>
        </Col>
        <Col>
          <Button size='large' onClick={onChooseFolderClick}>Choose Sketches Folder</Button>
        </Col>
      </Row>
    </Content>
  </Wrapper>

Home.propTypes = {
  onChooseFolderClick: PropTypes.func.isRequired,
  onLoadClick: PropTypes.func.isRequired,
}

export default Home
