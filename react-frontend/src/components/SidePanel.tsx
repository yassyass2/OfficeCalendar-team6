import React from 'react';

const mockEventData = {
  title: 'Weekly stand-up van Jeanine en Alex - BaseCamp',
  date: '1 december 2014',
  time: '09:00 - 09:30',
  attendees: 12,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae dui id turpis venenatis ultrices vel sed urna. Nunc bibendum sodales augue sed porttitor.Suspendisse potenti. Ut ac leo magna. Phasellus rhoncus arcu vitae sem ullamcorper, in feugiat dolor pulvinar.Sed auctor leo ut lorem sollicitudin congue. Integer rhoncus, est quis scelerisque commodo, massa velit hendrerit ligula, sed posuere mi felis quis enim.Nullam efficitur diam id velit pellentesque, quis volutpat arcu faucibus. Maecenas facilisis tempor dignissim. Phasellus consectetur congue porttitor. Mauris id sem et orci ornare efficitur eget vitae tellus. Phasellus porttitor ac turpis nec feugiat. Quisque ultricies nibh id tristique feugiat.Duis dignissim eros vel felis scelerisque, id fermentum ex facilisis. Suspendisse id dolor neque. Sed pellentesque finibus urna non interdum.',
};

const SidePanel: React.FC = () => {
  return (
    <div className="row g-0">
      <div className="col-auto sidepanel-container">
        <h2>{mockEventData.title}</h2>
        <div className="event-metadata">
          <i className="fa-regular fa-calendar"></i>
          <span>{mockEventData.date}</span>

          <i className="fa-regular fa-clock"></i>
          <span>{mockEventData.time}</span>

          <i className="fa-solid fa-user"></i>
          <span>
            <span className="attendees-number">
              {mockEventData.attendees}
            </span>{' '}
            attending
          </span>
        </div>

        <div className="event-body">
          {mockEventData.description}
        </div>

        <button className="btn-primary">
          ATTEND EVENT
          <i className="fa-solid fa-caret-right" style={{ marginLeft: '10px', color: '#ffffff' }}></i>
        </button>
      </div>
    </div>
  );
}

export default SidePanel;
