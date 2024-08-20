import React from 'react';

const TweetCard = ({ tweet, onDelete }) => {
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded">
      <p>{tweet}</p>
      {onDelete && (
        <button 
          onClick={onDelete} 
          className="px-4 py-2 bg-red-500 text-white rounded mt-2"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default TweetCard;
