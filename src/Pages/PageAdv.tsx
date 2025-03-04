import { useNeighbourContext } from '../Hooks/neighbourContext';
import { useNeighbourDataContext } from '../Hooks/neighbourDataContext';
import { DistroData } from '../../Types';
import '../Styles/PageAdv.css'

export const PageAdv = () => {
    const { selectedNeighbour } = useNeighbourContext();
    const { neighbourData } = useNeighbourDataContext();

    if (!selectedNeighbour) {
        return null;
    }

    return (
        <div className="gridAdv">
            <PhaseRow phaseIndex={0} neighbourData={neighbourData} />
            <AdvRow className={'pf'} prefix={'pf'} neighbourData={neighbourData} />
            <PhaseRow phaseIndex={1} neighbourData={neighbourData} />
            <AdvRow className={'kva'} prefix={'kVA'} neighbourData={neighbourData} />
            <PhaseRow phaseIndex={2} neighbourData={neighbourData} />
            <AdvRow className={'hz'} prefix={'HZ'} neighbourData={neighbourData} />
        </div>
    );
};


const PhaseRow = ({ phaseIndex, neighbourData }: { phaseIndex: 0 | 1 | 2, neighbourData: DistroData | null }) => {
    return (
        <>
            <div className={`span-seven-adv ${'l' + (phaseIndex + 1)}`}>
                <div>
                    <span className="valueAdv">
                        {(neighbourData?.phases[phaseIndex]!.voltage! > -1 && (Math.round((neighbourData?.phases[phaseIndex]!.voltage || 0) * 100) / 100).toFixed(1))}
                    </span>
                    <span className="unitBasic">
                        v
                    </span>
                </div>
            </div>
            <div className={`span-five-adv ${'l' + (phaseIndex + 1)}`}>
                <div>
                    <span className="valueAdvAmperage">
                        {(neighbourData?.phases[phaseIndex]!.amperage! > -1 && (Math.round((neighbourData?.phases[phaseIndex]!.amperage || 0) * 100) / 100).toFixed(1))}
                    </span>
                    <span className="unitBasic">
                        a
                    </span>
                </div>
            </div>
        </>
    )
}

const AdvRow = ({ className, prefix, neighbourData }: { className: string, prefix: string, neighbourData: DistroData | null }) => {
    return (
        <>
            <div className={`span-seven-adv ${className}`}>
                <div>
                    <span className="valueBasic">
                        {prefix === 'pf' ? Math.round((neighbourData?.pf || 0) * 1000) / 1000
                            : prefix === 'kVA' ? Math.round((neighbourData?.kva || 0) * 100) / 100
                                : Math.round((neighbourData?.hz || 0) * 100) / 100}
                    </span>
                    <span className="unitBasic">
                        {prefix}
                    </span>
                </div>
            </div>
        </>
    )
}