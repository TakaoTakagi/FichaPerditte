import React, { useState, useEffect } from 'react';

const getImageName = (part, current, max) => {
  const percentage = current / max;

  let level;
  if (percentage === 1) level = 100;
  else if (percentage >= 0.75) level = 75;
  else if (percentage >= 0.45) level = 50;
  else if (percentage >= 0.1) level = 25;
  else level = 0;

  return `${part}_${level}.png`;
};

const CharacterSheet = ({ personagem, setPersonagem }) => {
  const [status, setStatus] = useState(personagem?.partes || {});

  useEffect(() => {
    setStatus(personagem?.partes || {});
  }, [personagem]);

  const changeHealth = (part, delta) => {
    setStatus(prev => {
      if (!prev[part]) return prev;

      const nova = { ...prev[part] };
      nova.current = Math.max(0, Math.min(nova.max, nova.current + delta));

      const novoStatus = { ...prev, [part]: nova };
      setPersonagem(old => ({ ...old, partes: novoStatus }));

      return novoStatus;
    });
  };

  const changeMaxHealth = (part, newMax) => {
    setStatus(prev => {
      if (!prev[part]) return prev;

      let maxNumber = parseInt(newMax, 10);
      if (isNaN(maxNumber) || maxNumber < 1) maxNumber = 1;

      const nova = { ...prev[part] };
      nova.max = maxNumber;
      if (nova.current > maxNumber) nova.current = maxNumber;

      const novoStatus = { ...prev, [part]: nova };
      setPersonagem(old => ({ ...old, partes: novoStatus }));

      return novoStatus;
    });
  };

  const changeCurrentHealth = (part, newCurrent) => {
    setStatus(prev => {
      if (!prev[part]) return prev;

      let currentNumber = parseInt(newCurrent, 10);
      if (isNaN(currentNumber)) currentNumber = 0;

      currentNumber = Math.max(0, Math.min(currentNumber, prev[part].max));

      const nova = { ...prev[part], current: currentNumber };
      const novoStatus = { ...prev, [part]: nova };
      setPersonagem(old => ({ ...old, partes: novoStatus }));

      return novoStatus;
    });
  };

  const renderPart = (part, top, left, width) => {
    if (!status[part]) return null;

    const { current, max } = status[part];
    const imageName = getImageName(part, current, max);

    let controlStyle = {};

    switch (part) {
      case 'head':
        controlStyle = { top: '10px', left: 'calc(100% + 5px)' };
        break;
      case 'torso':
        controlStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        break;
      case 'leftArm':
        controlStyle = { top: '50%', left: '-60px', transform: 'translateY(-50%)' };
        break;
      case 'rightArm':
        controlStyle = { top: '50%', left: '100%', transform: 'translateY(-50%)' };
        break;
      case 'leftLeg':
        controlStyle = { top: '50%', left: '-60px', transform: 'translateY(-50%)' };
        break;
      case 'rightLeg':
        controlStyle = { top: '50%', left: '100%', transform: 'translateY(-50%)' };
        break;
      default:
        controlStyle = {};
    }

    return (
      <div
        key={part}
        className="absolute"
        style={{ top, left, width, position: 'absolute', zIndex: part === 'torso' ? 20 : 10 }}
      >
        <div
          className="absolute flex flex-col gap-1 bg-white px-2 py-1 rounded shadow"
          style={{ ...controlStyle, zIndex: 30, width: '110px' }}
        >
          <div className="flex items-center justify-between">
            <button onClick={() => changeHealth(part, -1)} className="text-red-500 font-bold px-2 rounded hover:bg-red-100">-</button>
            <input
              type="number"
              value={current}
              onChange={(e) => changeCurrentHealth(part, e.target.value)}
              style={{ width: '20px' }}
              className="text-center border rounded"
              min={0}
              max={max}
            />
            <button onClick={() => changeHealth(part, 1)} className="text-green-500 font-bold px-2 rounded hover:bg-green-100">+</button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs mr-2">Max:</label>
            <input
              type="number"
              value={max}
              onChange={(e) => changeMaxHealth(part, e.target.value)}
              style={{ width: '20px' }}
              className="text-center border rounded"
              min={1}
            />
          </div>
        </div>
        <img
          src={`/parts/${imageName}`}
          alt={part}
          style={{ width: width, transform: 'none', zIndex: part === 'torso' ? 20 : 10 }}
        />
      </div>
    );
  };

  if (!personagem || !personagem.partes || Object.keys(status).length === 0) {
    return <p>Carregando ficha...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">{personagem.nome}</h2>
      <div className="relative w-[262px] h-[616px] bg-transparent">
        {renderPart('head', '9px', '530px', '95px')}
        {renderPart('torso', '95px', '506px', '142px')}
        {renderPart('leftArm', '129px', '472px', '56px')}
        {renderPart('rightArm', '129px', '626px', '56px')}
        {renderPart('leftLeg', '284px', '508px', '70px')}
        {renderPart('rightLeg', '284px', '576px', '70px')}
      </div>
    </div>
  );
};

export default CharacterSheet;
