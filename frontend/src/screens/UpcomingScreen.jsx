import plants from "../plantData.js";

const UpcomingScreen = () => {
  return (
    <div className="div-container-projects">
{plants.map((plant) => (
      <div key={plant.id} className="div-projects">
        {plant.id !== 1 && <hr />}

        <h1 className="h1-upcoming">Projetos</h1>
        <h2 className="h2-upcoming">Contos</h2>
        <div className="project-container upcoming-container">
        <div id="div-image-upcoming">
            <img
              className="image-upcoming"
              src={plant.image}
              alt=" cover of plant title "
            />
          </div>
          <div className="div-text-container-upcoming">
            <h3 className="h3-upcoming">{plant.title}</h3>
            <h4 className="h4-upcoming">Data de lançamento{plant.releaseDate}</h4>
            <div className="div-parag">
              <p className="upcoming-para">{plant.description}</p>
            </div>

            <a href="https://www.mercadolivre.com.br/" target="__blank">
              Reserve sua Cópia
            </a>
          </div>
        </div>
      </div>      
      ))}
    </div>
  );
};

export default UpcomingScreen;
