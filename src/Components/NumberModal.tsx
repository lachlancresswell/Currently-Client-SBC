import React, { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../Styles/ConfigModal.css'
import { ConfigVariable } from '../../Types';
import { ArrowUp, ArrowDown } from "./CommonUI";

/**
 * Validate and update a number value.
 * @param setting The setting to validate against
 * @param newValue The new value to validate
 * @returns The updated value
 */
export const validateAndUpdateValue = (setting: ConfigVariable, newValue: number) => {
    if (setting.min !== undefined && newValue < setting.min) {
        return setting.min;
    }

    if (setting.max !== undefined && newValue > setting.max) {
        return setting.max;
    }

    return newValue;
}

/**
 * A component for displaying and manipulating a number.
 * @param setting The setting to display
 * @param onClose The function to call when the modal is closed
 * @param onSubmit The function to call when the modal is submitted
 * @param updated Optional: whether the setting has been updated
 * @returns A React component
 */
export const NumberModal = ({
    setting,
    onClose,
    onSubmit,
    updated
}: {
    setting: ConfigVariable,
    onClose: () => void,
    onSubmit: (setting: ConfigVariable) => void,
    updated?: boolean
}) => {
    const [value, setValue] = useState<number>(parseInt(setting.value || '0'));
    const [startValue] = useState<number>(value);

    const resetValue = () => setValue(startValue);

    const isDisabled = () => updated || (value === startValue)

    return (
        <div className='gridModal-flex'>
            <Value onChange={(e) => setValue(parseInt(e.target.value))} value={value} max={setting.max} />
            <div className='modal-flex-1'>
                <ArrowUp onClick={() => setValue(validateAndUpdateValue(setting, value + 1))} />
                <ArrowDown onClick={() => setValue(validateAndUpdateValue(setting, value - 1))} />
            </div>
            <div className='modal-flex-1'>
                <button className='modal-button-method-flex modal-button-x' onClick={() => onClose()} data-testid={'Close-button'}>
                    X
                </button>
                <button className='modal-button-method-flex input-modified-reset' disabled={isDisabled()} onClick={resetValue} data-testid={'Refresh-button'}>
                    <RefreshIcon />
                </button>
                <button className="modal-button-method-flex input-modified" disabled={isDisabled()} onClick={() => onSubmit({ ...setting, ...{ value: value.toString() } })} data-testid={'OK-button'}>
                    OK
                </button>
            </div>
        </div >
    )
};

const Value = ({ value, max, onChange }: { value: number | string, max?: number, onChange?: React.ChangeEventHandler<HTMLInputElement> }) => {
    if (!max) max = 254;
    return (
        <div className='modal-flex-1'>
            <input
                className='modal-input'
                type='number'
                value={value}
                onChange={onChange}
                min="0"
                max={max.toString()}
                data-testid={'Value-input'}
            />
        </div>
    )
}