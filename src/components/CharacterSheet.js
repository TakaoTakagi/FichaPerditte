import React, { useState } from 'react';

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

const CharacterSheet = ({ personagem }) => {
  const [status, setStatus] = useState(personagem.partes);
  const changeHealth = (part, delta) => {
    setStatus((prev) => {
      const nova = { ...prev[part] };
      nova.current = Math.max(0, Math.min(nova.max, nova.current + delta));
      return { ...prev, [part]: nova };
    });
  };

  // ⬇️ Essa função é usada para renderizar cada parte
 const renderPart = (part, top, left, width) => {
  const { current, max } = status[part];
  const imageName = getImageName(part, current, max);

  // Estilo do controle (botões e número)
  let controlStyle = {};

  switch (part) {
    case 'head':
      controlStyle = {
        top: '10px',
        left: 'calc(100% + 5px)', // ao lado da cabeça
      };
      break;
    case 'torso':
      controlStyle = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // centralizado sobre o torso
      };
      break;
    case 'leftArm':
      controlStyle = {
        top: '50%',
        left: '-60px', // à esquerda
        transform: 'translateY(-50%)',
      };
      break;
    case 'rightArm':
      controlStyle = {
        top: '50%',
        left: '100%', // à direita
        transform: 'translateY(-50%)',
      };
      break;
    case 'leftLeg':
      controlStyle = {
        top: '50%',
        left: '-60px',
        transform: 'translateY(-50%)',
      };
      break;
    case 'rightLeg':
      controlStyle = {
        top: '50%',
        left: '100%',
        transform: 'translateY(-50%)',
      };
      break;
  }

  return (
    <div
      key={part}
      className="absolute"
      style={{
        top,
        left,
        width,
        position: 'absolute',
        zIndex: part === 'torso' ? 20 : 10,
      }}
    >
      {/* Controles */}
      <div
        className="absolute flex items-center gap-1 text-xs bg-white px-1 rounded shadow"
        style={{
          position: 'absolute',
          ...controlStyle,
          zIndex: 30,
        }}
      >
        <button onClick={() => changeHealth(part, -1)} className="text-red-500">-</button>
        <span>{current}/{max}</span>
        <button onClick={() => changeHealth(part, 1)} className="text-green-500">+</button>
      </div>

      {/* Imagem */}
      <img
        src={`/parts/${imageName}`}
        alt={part}
        style={{
          width: width,
          transform: 'none',
          zIndex: part === 'torso' ? 20 : 10,
        }}
      />
    </div>
  );
};

  // ⬇️ Esse é o return final do componente
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">{personagem.nome}</h2>
      <div className="relative w-[262px] h-[616px] bg-transparent mx-auto">
        {renderPart('head', '9px', '430px', '95px')}
        {renderPart('torso', '95px', '406px', '142px')}
        {renderPart('leftArm', '129px', '372px', '56px')}
        {renderPart('rightArm', '129px', '526px', '56px')}
        {renderPart('leftLeg', '284px', '408px', '70px')}
        {renderPart('rightLeg', '284px', '476px', '70px')}
      </div>
    </div>
  );
};
export default CharacterSheet;
