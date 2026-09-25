import SimulatorPage from "../components/editorial/SimulatorPage";
import BeerSimulator from "../components/simulators/BeerSimulator";
export default function BeerSimulatorPage() {
 return <SimulatorPage title={"Composer\nune bière."} description="Malts, houblons, fermentation et garde : explorez l’équilibre de votre recette." chapter="04 / BRASSAGE" object="tank"><BeerSimulator /></SimulatorPage>;
}
