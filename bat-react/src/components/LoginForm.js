import Button from './Button';
import './styles.scss'

const LoginForm = p => {

  return (
    <main className='appointment__card appointment__card--create'>
      <form>
      <header >Choose a name: </header>
        <input 
        placeholder='Cattle Bruiser' 
        className='text--semi-bold appointment__create-input' />
        <Button setTheBoard={p.setTheBoard} msg='play multi' />
        <Button setTheBoard={p.setSingleBoard} msg='single' />
      </form>
    </main>
  )

}

export default LoginForm;