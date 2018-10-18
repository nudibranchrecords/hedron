import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BankSelect from '../BankSelect'

const Item = styled.div`
  padding: 0.5rem;
  border: 1px solid #111;
  margin-bottom: 0.5rem;
  display: flex;
  height: 2.5rem;
  align-items: center;
`

const Col = styled.div`
  margin-right: auto;

  & h5 {
    margin-bottom: 0;
  }
`
const Info = styled.span`
  display: block;
  font-size: 0.4rem;
  opacity: 0.5;
`

const Devices = ({ items }) => (
  <div>
    <h6>Connected Devices</h6>
    <ul>
      {items.map(item => {
        const m = item.lastMessage
        return (
          <li key={item.id}>
            <Item>
              <Col>
                <h5>{item.title} - {item.manufacturer}</h5>
                {m &&
                  <div>
                    <Info>{m.data[0]} / {m.data[1]} / {m.data[2]} - {m.timeStamp}</Info>
                  </div>
                }
              </Col>
              <BankSelect deviceId={item.id} />
            </Item>
          </li>
        )
      })}
    </ul>
  </div>
)

Devices.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    manufacturer:  PropTypes.string.isRequired,
  })),
}

export default Devices
