import React from 'react';
import './LogoBlock.css';
import LogoShield from '../../assets/images/LogoShield.svg';

export default function LogoBlock() {
  return (
    <div className="logoBlock">
      <img src={LogoShield} alt="Munin Alert Logo" className="logoBlock-img" />
      <div className="logoBlock-text">MUNIN ALERT</div>
      <div className="logoBlock-progress" />
    </div>
  );
}
