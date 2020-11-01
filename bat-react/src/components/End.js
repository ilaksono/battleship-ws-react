import React from 'react';
import Button from './Button';

const End = (p) => {
  return(
    <div>
      <header>
        {p.header}
      </header>
      <Button msg='Play Again' setTheBoard={p.reset}/>
    </div>
  )

}

export default End;