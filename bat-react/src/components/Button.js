import './Button.scss';

const Button = p => {
  const className = `button ${p.msg === 'play multi' ? 'button--confirm': 'button--danger' }`
  return (
    <button className={className} onClick={p.setTheBoard}>
      {p.msg}
    </button>
  )
}
export default Button;