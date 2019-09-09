import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Input from '../Input'
import Select from '../../containers/Select'

const Wrapper = styled.div`
  padding: 0.5rem;
  border: 1px solid #111;
  margin-bottom: 0.5rem;
  display: flex;
  height: 2.5rem;
  align-items: center;
`

const Main = styled.div`
  margin-right: auto;

  & h5 {
    margin-bottom: 0;
  }
`

const Aux = styled.div`
  margin-left: auto;
`

const Info = styled.span`
  display: block;
  font-size: 0.4rem;
  opacity: 0.5;
`

const Device = ({ title, manufacturer, lastMessage, id }) => {
  const m = lastMessage
  const channelOptions = Array(16).fill().map((val, index) => ({ value: index, label: index + 1 }))

  return (
    <Wrapper>
      <Main>
        <h5>{title} - {manufacturer}</h5>
        {m &&
          <div>
            <Info>{m.data[0]} / {m.data[1]} / {m.data[2]} - {m.timeStamp}</Info>
          </div>
        }
      </Main>
      <Aux>
        <form onSubmit={e => e.preventDefault()}>
          <Input
            name='forceChannel'
            id={`forceChannel_${id}`}
            label='Force Channel'
            component={Select}
            layout='compact'
            options={[
              { value: false, label: '-' },
              ...channelOptions,
            ]}
          />
        </form>
      </Aux>
    </Wrapper>
  )
}

Device.propTypes = {
  lastMessage: PropTypes.object,
  title: PropTypes.string.isRequired,
  manufacturer:  PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default Device
