import { createHashRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import AllProjects from './components/allProjects/AllProjects';
import { Toaster } from 'react-hot-toast';


function App() {




  const myRouter =  createHashRouter([
                

                { path:"/", element:<Layout/> , children:[

                    { index:true, element: <AllProjects/>},
                    { path:"alltasks"  , element:<AllProjects/>    }

                             ]}


         ])
       

  return <>
   
           
  
  
         <Toaster />
     <RouterProvider router={myRouter}/>
  
  
  
  
  
  
  
  </>
}

export default App;
