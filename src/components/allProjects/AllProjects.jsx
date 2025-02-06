import React from 'react'

export default function AllProjects({ setSearchTerm }) {
  return <>
  
       <h1 className=' h3 mb-3'>All Tasks</h1>
       <div className=' mb-2'>
        <form className="d-flex">
          <input
            type="text"
            className="form-control rounded-pill"
            placeholder="Search Tasks"
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </form>
      </div>
  </>
}
