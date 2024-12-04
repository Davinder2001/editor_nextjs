import React from 'react'
const inputRef = useRef(null);
const focusInput = () => {
    inputRef.current.focus();
  };

const Page = () => {
  return (
    <div>
    <input ref={inputRef} />
    <button onClick={focusInput}>Focus Input</button>
  </div>
  )
}

export default Page







  

