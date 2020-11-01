const Button = p => {
  return (
    <button onClick={p.setTheBoard}>
      {p.msg}
    </button>
  )
}
export default Button;