import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FaDumbbell, FaHeartbeat, FaAppleAlt, FaRunning, 
  FaBiking, FaSwimmer, FaUserCircle, FaFireAlt 
} from 'react-icons/fa';
import './FloatingIcons.css';

const FloatingIcons = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define icon sets based on routes
  const getRouteIcons = () => {
    switch (currentPath) {
      case '/diet':
        return [
          { icon: <FaAppleAlt />, size: 'small', delay: '0s', pos: { top: '15%', left: '10%' }, colorClass: 'icon-green' },
          { icon: <FaHeartbeat />, size: 'medium', delay: '2s', pos: { top: '65%', left: '85%' }, colorClass: 'icon-red' },
          { icon: <FaFireAlt />, size: 'large', delay: '4s', pos: { top: '40%', left: '5%' }, colorClass: 'icon-orange' },
          { icon: <FaAppleAlt />, size: 'small', delay: '1s', pos: { top: '80%', left: '20%' }, colorClass: 'icon-green' },
          { icon: <FaHeartbeat />, size: 'medium', delay: '3s', pos: { top: '25%', left: '75%' }, colorClass: 'icon-red' },
          { icon: <FaAppleAlt />, size: 'small', delay: '5s', pos: { top: '10%', left: '60%' }, colorClass: 'icon-green' },
          { icon: <FaFireAlt />, size: 'small', delay: '2.5s', pos: { top: '50%', left: '50%' }, colorClass: 'icon-orange' },
          { icon: <FaHeartbeat />, size: 'small', delay: '4.5s', pos: { top: '90%', left: '40%' }, colorClass: 'icon-red' },
        ];
      case '/exercise':
      case '/features':
        return [
          { icon: <FaDumbbell />, size: 'large', delay: '0s', pos: { top: '20%', left: '15%' }, colorClass: 'icon-blue' },
          { icon: <FaRunning />, size: 'medium', delay: '1.5s', pos: { top: '70%', left: '80%' }, colorClass: 'icon-purple' },
          { icon: <FaBiking />, size: 'small', delay: '3s', pos: { top: '45%', left: '10%' }, colorClass: 'icon-yellow' },
          { icon: <FaSwimmer />, size: 'large', delay: '2s', pos: { top: '15%', left: '85%' }, colorClass: 'icon-teal' },
          { icon: <FaDumbbell />, size: 'medium', delay: '4s', pos: { top: '85%', left: '30%' }, colorClass: 'icon-blue' },
          { icon: <FaRunning />, size: 'small', delay: '0.5s', pos: { top: '30%', left: '60%' }, colorClass: 'icon-purple' },
          { icon: <FaBiking />, size: 'small', delay: '2.5s', pos: { top: '80%', left: '50%' }, colorClass: 'icon-yellow' },
          { icon: <FaSwimmer />, size: 'small', delay: '5s', pos: { top: '5%', left: '40%' }, colorClass: 'icon-teal' },
          { icon: <FaDumbbell />, size: 'small', delay: '1.8s', pos: { top: '55%', left: '95%' }, colorClass: 'icon-blue' },
        ];
      case '/profile':
        return [
          { icon: <FaUserCircle />, size: 'medium', delay: '0s', pos: { top: '15%', left: '15%' }, colorClass: 'icon-blue' },
          { icon: <FaFireAlt />, size: 'small', delay: '2s', pos: { top: '60%', left: '85%' }, colorClass: 'icon-orange' },
          { icon: <FaHeartbeat />, size: 'large', delay: '4s', pos: { top: '35%', left: '5%' }, colorClass: 'icon-red' },
          { icon: <FaRunning />, size: 'medium', delay: '1s', pos: { top: '80%', left: '25%' }, colorClass: 'icon-purple' },
          { icon: <FaUserCircle />, size: 'small', delay: '3s', pos: { top: '10%', left: '70%' }, colorClass: 'icon-blue' },
          { icon: <FaHeartbeat />, size: 'small', delay: '5s', pos: { top: '95%', left: '60%' }, colorClass: 'icon-red' },
          { icon: <FaFireAlt />, size: 'small', delay: '1.5s', pos: { top: '45%', left: '50%' }, colorClass: 'icon-orange' },
        ];
      default: // Home, About, etc.
        return [
          { icon: <FaDumbbell />, size: 'large', delay: '0s', pos: { top: '15%', left: '10%' }, colorClass: 'icon-blue' },
          { icon: <FaHeartbeat />, size: 'medium', delay: '2s', pos: { top: '55%', left: '85%' }, colorClass: 'icon-red' },
          { icon: <FaRunning />, size: 'small', delay: '4s', pos: { top: '85%', left: '15%' }, colorClass: 'icon-purple' },
          { icon: <FaAppleAlt />, size: 'medium', delay: '1s', pos: { top: '25%', left: '75%' }, colorClass: 'icon-green' },
          { icon: <FaFireAlt />, size: 'large', delay: '3s', pos: { top: '70%', left: '90%' }, colorClass: 'icon-orange' },
          { icon: <FaDumbbell />, size: 'small', delay: '5s', pos: { top: '40%', left: '5%' }, colorClass: 'icon-blue' },
          { icon: <FaBiking />, size: 'small', delay: '0.5s', pos: { top: '5%', left: '50%' }, colorClass: 'icon-yellow' },
          { icon: <FaSwimmer />, size: 'small', delay: '2.5s', pos: { top: '90%', left: '60%' }, colorClass: 'icon-teal' },
          { icon: <FaFireAlt />, size: 'small', delay: '1.5s', pos: { top: '45%', left: '45%' }, colorClass: 'icon-orange' },
          { icon: <FaHeartbeat />, size: 'small', delay: '3.5s', pos: { top: '15%', left: '95%' }, colorClass: 'icon-red' },
        ];
    }
  };

  const icons = getRouteIcons();

  return (
    <div className="floating-icons-container">
      {icons.map((item, index) => (
        <div 
          key={index} 
          className={`floating-icon ${item.size} ${item.colorClass}`}
          style={{
            ...item.pos,
            animationDelay: item.delay
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
