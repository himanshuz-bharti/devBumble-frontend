import React,{useState} from 'react'

function UserCard({feed,currentIndex,handleCross,handleTick,animation}) {
  return (
    <div className="perspective-1000">
          <div className={`w-80 border border-gray-300 rounded-lg shadow-md p-6 bg-white text-center transition-all duration-500 ease-in-out ${animation === 'left' ? '-translate-x-full rotate-[-30deg] opacity-0' : animation === 'right' ? 'translate-x-full rotate-[30deg] opacity-0' : ''}`}>
            <img
              src={feed[currentIndex].photourl}
              alt={`${feed[currentIndex].firstname} ${feed[currentIndex].lastname}`}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">
              {feed[currentIndex].firstname} {feed[currentIndex].lastname}
            </h3>
            <p className="text-sm text-gray-600">Age: {feed[currentIndex].age}</p>
            <p className="text-sm text-gray-600">Gender: {feed[currentIndex].gender}</p>
            <div className="flex justify-around mt-6">
              <button
                onClick={()=>{handleCross(feed[currentIndex]._id)}}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                ❌ Ignore
              </button>
              <button
                onClick={()=>{handleTick(feed[currentIndex]._id)}}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                ✅ Interested
              </button>
            </div>
          </div>
        </div>
      )
}

export default UserCard
