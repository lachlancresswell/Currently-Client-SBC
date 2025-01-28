import { useNeighbourContext } from '../Hooks/neighbourContext';
import { useNeighbourDataContext } from '../Hooks/neighbourDataContext';
import { DistroData } from '../../Types';
import { Warning } from '../Components/Warnings';
import '../Styles/PageBasic.css'

export const PageBasic = () => {
    const { selectedNeighbour } = useNeighbourContext();
    const { neighbourData } = useNeighbourDataContext();

    if (!selectedNeighbour) {
        return null;
    }

    return (
        <div className="gridBasic">
            <PhaseRow phaseIndex={0} neighbourData={neighbourData} />
            <PhaseRow phaseIndex={1} neighbourData={neighbourData} />
            <PhaseRow phaseIndex={2} neighbourData={neighbourData} />
        </div>
    );
};


const PhaseRow = ({ phaseIndex, neighbourData }: { phaseIndex: 0 | 1 | 2, neighbourData: DistroData | null }) => {
    return (
        <>
            <div className={`span-five-basic ${'l' + (phaseIndex + 1)}`}>
                <span className="valueBasic">
                    {Math.round(neighbourData?.phases[phaseIndex].voltage || 0)}
                </span>
                <span className="unitBasic">
                    v
                </span>
            </div>
            <div className={`span-three-basic ${'l' + (phaseIndex + 1)}`}>
                <div className='basicAmperage'>
                    <span className="valueBasicAmperage">
                        {Math.round(neighbourData?.phases[phaseIndex].amperage || 0)}
                    </span>
                    <span className="unitBasic">
                        a
                    </span>
                </div>
            </div>
            <div className='span-two-basic'>
                {neighbourData && <Warning data={neighbourData} type={'va'} phaseIndex={phaseIndex} />}
            </div>
        </>
    )
}