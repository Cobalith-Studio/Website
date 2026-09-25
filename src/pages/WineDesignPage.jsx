import SimulatorPage from "../components/editorial/SimulatorPage";
import WineDesignSimulator from "../components/simulators/WineDesignSimulator";
export default function WineDesignPage() {
 return <SimulatorPage title={"Concevoir\nun vin."} description="Du cépage à l’élevage, construisez une recette et observez son profil final." chapter="02 / COMPOSITION" object="bottle"><WineDesignSimulator /></SimulatorPage>;
}
