import { render, fireEvent, screen } from '@testing-library/react';
import { NumberModal, validateAndUpdateValue } from '../../../Components/NumberModal';

describe('validateAndUpdateValue', () => {
    const setting: any = { min: 0, max: 10 };
    it('updates value if it is within the min and max range', () => {
        // Act
        const rtn = validateAndUpdateValue(setting, 5);

        // Assert
        expect(rtn).toBe(5);
    });

    it('updates value to min if it is less than min', () => {
        // Act
        const rtn = validateAndUpdateValue(setting, -1);

        // Assert
        expect(rtn).toBe(0);
    });

    it('updates value to max if it is greater than max', () => {
        // Act
        const rtn = validateAndUpdateValue(setting, 11);

        // Assert
        expect(rtn).toBe(10);
    });
});

const setting: any = { value: 5, min: 0, max: 10 };
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const testScreen = () => {

    render(<NumberModal setting={setting} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    const arrowUp = screen.getByTestId("ArrowUp");
    const arrowDown = screen.getByTestId("ArrowDown");
    const valueInput = screen.getByTestId('Value-input');
    const buttonRefresh = screen.getByTestId("Refresh-button");
    const buttonOK = screen.getByTestId("OK-button");
    const buttonClose = screen.getByTestId("Close-button");

    return { arrowUp, arrowDown, valueInput, buttonRefresh, buttonOK, buttonClose };
}

afterEach(() => {
    jest.clearAllMocks();
});

describe('NumberModal', () => {
    it('renders the value input', () => {
        // Arrange
        const { valueInput } = testScreen();

        // Assert
        expect(valueInput).toBeInTheDocument();
    });

    it('renders the current value', () => {
        // Arrange
        const { valueInput } = testScreen();

        // Assert
        expect(valueInput).toHaveValue(setting.value);
    });

    it('updates the value when the up arrow is clicked', () => {
        // Arrange
        const { arrowUp, valueInput } = testScreen();

        // Act
        fireEvent.click(arrowUp);

        // Assert
        expect(valueInput).toHaveValue(setting.value + 1);
    });

    it('updates the value when the down arrow is clicked', () => {
        // Arrange
        const { arrowDown, valueInput } = testScreen();

        // Act
        fireEvent.click(arrowDown);

        expect(valueInput).toHaveValue(setting.value - 1);
    });

    it('value does not go above configured maximum when the up arrow is clicked', () => {
        // Arrange
        const { arrowUp, valueInput } = testScreen();

        // Act
        for (let i = 0; i < setting.max + 100; i++) {
            fireEvent.click(arrowUp);
        }

        // Assert
        expect(valueInput).toHaveValue(setting.max);
    });

    it('resets the value when the reset button is clicked', () => {
        // Arrange 
        const { arrowDown, valueInput, buttonRefresh } = testScreen();

        // Act
        fireEvent.click(arrowDown);
        fireEvent.click(buttonRefresh);

        expect(valueInput).toHaveValue(setting.value);
    });

    it('calls submit function when the OK button is clicked', () => {
        // Arrange
        const { arrowUp, buttonOK } = testScreen();

        // Act
        fireEvent.click(arrowUp);
        fireEvent.click(buttonOK);

        // Assert
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('submits the updated value when the OK button is clicked', () => {
        // Arrange
        const { arrowUp, buttonOK } = testScreen();

        // Act
        fireEvent.click(arrowUp);
        fireEvent.click(buttonOK);

        // Assert
        expect(mockOnSubmit.mock.calls[0][0].value).toBe(`${setting.value + 1}`);
    });

    it('calls close function when close button is clicked', () => {
        // Arrange
        const { buttonClose } = testScreen();

        // Act
        fireEvent.click(buttonClose);

        // Assert
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});