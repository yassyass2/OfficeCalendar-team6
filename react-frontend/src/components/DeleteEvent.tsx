import React from 'react';
import { useParams } from 'react-router-dom';

const DeleteEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const handleDelete = () => {
    console.log('Deleting event with ID:', eventId);
    alert('Event deleted successfully!');
  };

  return (
    <div>
      <h1>Delete Event</h1>
      <p>Are you sure you want to delete the event with ID: {eventId}?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
    </div>
  );
};

export default DeleteEvent;
