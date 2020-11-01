import Button from './Button';
const LoginForm = p => {

  return (
    <div>
      <input placeholder='Cattle Bruiser' />
      <Button setTheBoard={p.setTheBoard} msg='play multi'/>
      <Button setTheBoard={p.setSingleBoard} msg='play single'/>

    </div>
  )

}

export default LoginForm;