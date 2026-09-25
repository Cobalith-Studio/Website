import SimulatorPage from "../components/editorial/SimulatorPage";
import WineRecipeFinder from "../components/simulators/WineRecipeFinder";
export default function WineRecipeFinderPage() {
 return <SimulatorPage title={"À la recherche\nd’une recette."} description="Définissez un profil cible, ajustez vos critères et comparez les chemins proposés." chapter="03 / EXPLORATION" object="press"><WineRecipeFinder /></SimulatorPage>;
}
