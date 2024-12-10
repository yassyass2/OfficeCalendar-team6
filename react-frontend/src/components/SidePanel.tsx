import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faClock, faBolt, faPlay } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockEventData = {
  title: 'Weekly stand-up van Jeanine en Alex - BaseCamp (1 dec)',
  date: '1 december 2014',
  time: '09:00 - 09:30',
  attendees: 12,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae dui id turpis venenatis ultrices vel sed urna. Nunc bibendum sodales augue sed porttitor.Suspendisse potenti. Ut ac leo magna. Phasellus rhoncus arcu vitae sem ullamcorper, in feugiat dolor pulvinar.Sed auctor leo ut lorem sollicitudin congue. Integer rhoncus, est quis scelerisque commodo, massa velit hendrerit ligula, sed posuere mi felis quis enim.Nullam efficitur diam id velit pellentesque, quis volutpat arcu faucibus. Maecenas facilisis tempor dignissim. Phasellus consectetur congue porttitor. Mauris id sem et orci ornare efficitur eget vitae tellus. Phasellus porttitor ac turpis nec feugiat. Quisque ultricies nibh id tristique feugiat.Duis dignissim eros vel felis scelerisque, id fermentum ex facilisis. Suspendisse id dolor neque. Sed pellentesque finibus urna non interdum.',
};

const SidePanel: React.FC = () => {
  return (
    <div
      className="position-fixed"
      style={{
        right: '0',
        width: '58.3333%',
        height: '640px',
        backgroundColor: '#ffffff',
        borderLeft: '2px solid #0D99FF',
        boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        overflowY: 'auto',
        padding: '30px',
      }}
    >
      <h2
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: '24px',
          paddingTop: '30px',
          paddingLeft: '30px',
        }}
      >
        {mockEventData.title}
      </h2>

      <div
        className="d-flex align-items-center"
        style={{
          marginTop: '20px',
          paddingLeft: '30px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
          fontStyle: 'italic',
          color: 'rgba(56, 58, 67, 0.5)',
        }}
      >
        <FontAwesomeIcon
          icon={faBookOpen}
          style={{ color: '#6C3BAA', opacity: '80%', marginRight: '5px' }}
        />
        <span>{mockEventData.date}</span>

        <span style={{ margin: '0 20px' }}></span>

        <FontAwesomeIcon
          icon={faClock}
          style={{ color: '#6C3BAA', opacity: '80%', marginRight: '5px' }}
        />
        <span>{mockEventData.time}</span>

        <span style={{ margin: '0 20px' }}></span>

        <FontAwesomeIcon
          icon={faBolt}
          style={{ color: '#6C3BAA', opacity: '80%' }}
        />
        <span>
          <span style={{ fontWeight: 700, fontStyle: 'italic' }}>
            {mockEventData.attendees}
          </span>{' '}
          attending
        </span>
      </div>

      <div
        style={{
          marginTop: '30px',
          paddingLeft: '30px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '18px',
          fontWeight: 400,
          color: '#383A43',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
        }}
      >
        {mockEventData.description}
      </div>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: '30px', paddingLeft: '30px' }}
      >
        <button
          style={{
            backgroundColor: '#6C3BAA',
            width: '200px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            color: '#ffffff',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            letterSpacing: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ATTEND EVENT
          <FontAwesomeIcon
            icon={faPlay}
            style={{ marginLeft: '10px', color: '#ffffff' }}
          />
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
