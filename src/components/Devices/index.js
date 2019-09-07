import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Input from '../Input'
import Select from '../../containers/Select'

const Item = styled.div`
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

const Devices = ({ items }) => (
  <form onSubmit={e => e.preventDefault()}>
    <h6>Connected Devices</h6>
    <ul>
      {items.map(item => {
        const m = item.lastMessage
        const channelOptions = Array(16).fill().map((val, index) => ({ value: index, label: index + 1 }))

        return (
          <li key={item.id}>
            <Item>
              <Main>
                <h5>{item.title} - {item.manufacturer}</h5>
                {m &&
                  <div>
                    <Info>{m.data[0]} / {m.data[1]} / {m.data[2]} - {m.timeStamp}</Info>
                  </div>
                }
              </Main>
              <Aux>
                <Input
                  name={`forceChannel_${item.id}`}
                  label='Force Channel'
                  component={Select}
                  layout='compact'
                  options={[
                    { value: false, label: '-' },
                    ...channelOptions,
                  ]}
                />
              </Aux>
            </Item>
          </li>
        )
      })}
    </ul>
  </form>
)

Devices.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    manufacturer:  PropTypes.string.isRequired,
  })),
}

export default Devices
