import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { VARIANTS, TRANSITIONS } from '../utils/animations';
import ScenarioTabs from '../components/scenarios/ScenarioTabs';
import SubsidiaryScenario from '../components/scenarios/SubsidiaryScenario';
import ITExporterScenario from '../components/scenarios/ITExporterScenario';
import FreelancerScenario from '../components/scenarios/FreelancerScenario';
import INREmployeeScenario from '../components/scenarios/INREmployeeScenario';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';

const SCENARIO_COMPONENTS = {
  subsidiary: SubsidiaryScenario,
  itExporter: ITExporterScenario,
  freelancer: FreelancerScenario,
  inrEmployee: INREmployeeScenario
};

export default function ScenarioSection() {
  const { state } = useAppContext();
  const { activeScenario, ratesData, selectedFY } = state;

  // Trigger data load for selected FY
  useExchangeRates(selectedFY);

  const ActiveScenario = SCENARIO_COMPONENTS[activeScenario];

  return (
    <section id="scenarios" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-20">
      {/* Section header */}
      <div className="mb-8">
        <p className="font-sans text-xs font-bold tracking-wider uppercase text-ink-light mb-2">Analysis Scenarios</p>
        <h2 className="font-display text-2xl md:text-3xl text-ink-base tracking-tight">Pick your role, see your numbers</h2>
        <p className="font-sans text-sm text-ink-muted mt-2 max-w-xl">Each scenario isolates a different way USD/INR movement affects real finances. Adjust parameters to match your situation.</p>
      </div>

      <ScenarioTabs />

      <div className="mt-6">
        {ratesData.loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {ratesData.error && !ratesData.loading && <ErrorBanner message={`Could not fetch live rates: ${ratesData.error}. Using estimated rates.`} />}

        <AnimatePresence mode="wait">
          {!ratesData.loading && (
            <motion.div key={activeScenario} variants={VARIANTS.fadeUp} initial="hidden" animate="visible" exit="hidden" transition={TRANSITIONS.normal}>
              {ActiveScenario && <ActiveScenario />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
