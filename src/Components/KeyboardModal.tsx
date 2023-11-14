import { useState } from "react"
import RefreshIcon from '@mui/icons-material/Refresh';
import { ConfigVariable } from "../../Types";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "./CommonUI";

export const MAX_INDEX = 16;

/**
 * Increments or decrements a letter at a given index in a string. z wraps to A and A wraps to z.
 * @param str - The string to modify.
 * @param index - The index of the letter to modify.
 * @param value - The amount to increment or decrement the letter by.
 * @returns A new string with the letter modified.
*/
export const setLetterRelative = (str: string[], index: number, value: number) => {
    const newStr = [...str];
    newStr[index] = String.fromCharCode(newStr[index].charCodeAt(0) + value);
    if (newStr[index].charCodeAt(0) > 'z'.charCodeAt(0)) newStr[index] = 'A';
    if (newStr[index].charCodeAt(0) < 'A'.charCodeAt(0)) newStr[index] = 'z';
    return newStr;
}

/**
 * Replaces non-breaking spaces with regular spaces and trims the string.
 * @param str - The string to modify.
 * @returns The modified string.
 */
export const replaceCharsAndTrim = (str: string): string => {
    const regex = new RegExp(String.fromCharCode(160), 'g');
    return str.replace(regex, ' ').trim();
};

/**
 * A component for displaying a string as a series of spans, with one span selected.
 * @param str - The string to display.
 * @param index - The index of the selected letter.
 * @returns React component.
 */
const StringInput = ({ str, index }: { str: string[], index: number }) => {
    return (
        <div className='span-ten-modal'>
            {str.map((letter, letterIndex) => {
                if (letterIndex === index) {
                    return <span className={'modal-selected'}>{letter}</span>
                } else {
                    return <span>{letter}</span>
                }
            })}
        </div>
    )
}

/**
 * A modal component for editing a string using a virtual keyboard.
 * @param setting - The configuration variable for the string.
 * @param onClose - A function to close the modal.
 * @param onSubmit - A function to submit the updated string.
 * @param updated - A boolean indicating whether the string has been updated.
 * @returns A React component.
 * @todo Add keyboard support.
 */
export const KeyboardModal = ({
    setting,
    onClose,
    onSubmit,
    updated
}: {
    setting: ConfigVariable<string>,
    onClose: () => void,
    onSubmit: (setting: ConfigVariable<string>) => void,
    updated?: boolean
}) => {
    const deviceNameAsArray = setting.value?.replaceAll(' ', String.fromCharCode(160)).padEnd(MAX_INDEX, String.fromCharCode(160)).split('') || [''.padEnd(MAX_INDEX, ' ')]
    const [deviceName, setDeviceName] = useState<string[]>(deviceNameAsArray)
    const [index, setIndex] = useState<number>(0);

    const resetValue = () => setDeviceName(deviceNameAsArray);

    const isDisabled = () => {
        if (updated) {
            return false
        }
        return (JSON.stringify(deviceName) === JSON.stringify(deviceNameAsArray))
    }

    return (
        <div className='gridModal'>
            <StringInput str={deviceName} index={index} />
            <ArrowUp onClick={() => setDeviceName(setLetterRelative(deviceName, index, 1))} />
            <ArrowDown onClick={() => setDeviceName(setLetterRelative(deviceName, index, -1))} />
            <ArrowLeft onClick={() => setIndex(index > 0 ? index - 1 : index)} />
            <ArrowRight onClick={() => setIndex(index < MAX_INDEX - 1 ? index + 1 : index)} />
            <button className='span-one-modal modal-button-method modal-button-x' onClick={() => onClose()}>X</button>
            <button className='span-one-modal modal-button-method input-modified-reset' disabled={isDisabled()} onClick={resetValue} data-testid={'Refresh-button'}><RefreshIcon /></button>
            <button className='span-one-modal modal-button-method input-modified' disabled={isDisabled()} onClick={() => {
                onSubmit({
                    ...setting, ...{
                        value: (() => {
                            return replaceCharsAndTrim(deviceName.join(''))
                        })()
                    }
                })
            }} data-testid={'OK-button'}>OK</button>
        </div >
    )
}
