const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span className="note-content">{note.content}</span> 
      <button className="importance-toggle" onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note