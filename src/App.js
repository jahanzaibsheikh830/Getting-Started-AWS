import Amplify from "aws-amplify";
import aws_exports from './aws-exports'
import Signup from './component/signup'
import Signin from './component/signin'
import { useState } from "react";
Amplify.configure(aws_exports)
function App() {
  const [confirmSignup,setConfirmedSignup] = useState(false)
  function handleSignup(){
    setConfirmedSignup(prev => !prev)
  }
  console.log(confirmSignup)
  return (
    <div>
    {confirmSignup === false? <Signup handleSignup={handleSignup}/>: <Signin handleSignup={handleSignup} />}
    </div>
  );
}

export default App;
