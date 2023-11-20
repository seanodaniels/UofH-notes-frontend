import { useState } from 'react'

const Display1 = (props) => {
  return(
      <div>{props.counter}</div>
  )
}

const Display = ({ counter }) => <div>{counter}</div>

const Button1 = (props) => {
  return(
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return(
    <div>
      <Display counter={counter} />
      <Button handleClick={decreaseByOne} text={'-'} />
      <Button handleClick={setToZero} text={'Reset'} />
      <Button handleClick={increaseByOne} text={'+'} />
    </div>
  )
}

export default App
