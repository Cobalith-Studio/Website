import SimulatorPage from "../components/editorial/SimulatorPage";
import WineSimulator from "../components/simulators/WineSimulator";
export default function WineSimulatorPage() {
 return <SimulatorPage title={"Le vin,\nchemin par chemin."} description="Explorez le graphe de vinification selon le contexte et le groupe de cépages." chapter="01 / VINIFICATION" object="grapes"><WineSimulator /></SimulatorPage>;
}
