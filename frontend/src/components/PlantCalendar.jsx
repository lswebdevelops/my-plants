import React from 'react';

const months = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const regionColors = {
  sul: "#e57373",       // red
  sudeste: "#fbc02d",   // yellow
  centroOeste: "#81c784", // green
  norte: "#64b5f6",     // blue
  nordeste: "#ba68c8"   // purple
};

// Mapeamento de chaves para nomes de exibição
const regionNames = {
  norte: "Norte",
  nordeste: "Nordeste",
  centroOeste: "Centro-Oeste",
  sudeste: "Sudeste",
  sul: "Sul"
};

const PlantCalendar = ({ monthsByRegion = {} }) => {
  // Pega as chaves das regiões e as ordena para consistência
  const sortedRegions = Object.keys(monthsByRegion).sort((a, b) => {
    const order = ['norte', 'nordeste', 'centroOeste', 'sudeste', 'sul'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="table-responsive">
      <table className="plant-calendar-table">
        <thead>
          <tr>
            <th>Mês</th> 
            {/* Cria os cabeçalhos das colunas com os nomes das regiões */}
            {sortedRegions.map(region => (
              <th key={region}>{regionNames[region] || region}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Cria uma linha para cada mês */}
          {months.map((month, index) => {
            const monthIndex = index + 1; // Jan = 1
            return (
              <tr key={month}>
                {/* A primeira célula é o nome do mês */}
                <td>{month}</td>
                
                {/* Cria uma célula para cada região nesta linha do mês */}
                {sortedRegions.map(region => {
                  const isActive = monthsByRegion[region]?.includes(monthIndex);
                  return (
                    <td 
                      key={region}
                      style={{ 
                        backgroundColor: isActive ? regionColors[region] : 'transparent',
                        color: isActive ? 'white' : 'inherit' // Opcional: muda a cor do texto para melhor contraste
                      }}
                    >
                      {/* Em vez de cor, você poderia colocar um check '✓' se quisesse */}
                      {/* {isActive ? '✓' : ''} */}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlantCalendar;