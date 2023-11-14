import { KeyboardModal, MAX_INDEX } from '../../../Components/KeyboardModal';
import { fireEvent, render, screen } from '@testing-library/react';

const mockOnSubmit = jest.fn();
const mockOnClose = jest.fn();
const setting = { value: 'ABC', label: 'Device Name', key: 'testkey', type: 'string' };

const testScreen = () => {
    render(<KeyboardModal setting={setting} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    const buttonOk = screen.getByTestId("OK-button");
    const arrowUp = screen.getByTestId("ArrowUp");
    const arrowDown = screen.getByTestId("ArrowDown");
    const arrowLeft = screen.getByTestId("ArrowLeft");
    const arrowRight = screen.getByTestId("ArrowRight");
    const buttonRefresh = screen.getByTestId("Refresh-button");

    return { buttonOk, arrowUp, arrowDown, arrowLeft, arrowRight, buttonRefresh };
}

afterEach(() => {
    jest.clearAllMocks();
});

describe('Arrows, scrolling and submitting', () => {
    describe('Submitting', () => {
        it('does not call onSubmit when OK button is clicked if string has not changed', () => {
            // Arrange
            const { buttonOk } = testScreen();

            // Act
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).not.toHaveBeenCalled()
        });

        it('calls onSubmit when OK button is clicked and string has changed', () => {
            // Arrange
            const { buttonOk, arrowUp } = testScreen();

            // Act
            fireEvent.click(arrowUp);
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).toHaveBeenCalledTimes(1)
        });

        it('calls onSubmit with the correct value when OK button is clicked and string has changed', () => {
            // Arrange
            const { buttonOk, arrowUp } = testScreen();

            // Act
            fireEvent.click(arrowUp);
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'BBC'
                }
            });
        });
    });

    describe('Arrows', () => {
        it('should increase the current character when up arrow is pressed', () => {
            // Arrange
            const { buttonOk, arrowUp } = testScreen();

            // Act
            fireEvent.click(arrowUp);
            fireEvent.click(buttonOk);

            // Assert
            // Wrap A to z
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'BBC'
                }
            });
        });

        it('should decrease the current character when down arrow is pressed', () => {
            // Arrange
            const { buttonOk, arrowDown } = testScreen();

            // Act
            fireEvent.click(arrowDown);
            fireEvent.click(buttonOk);

            // Assert
            // Wrap A to z
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'zBC'
                }
            });
        });
    });

    describe('Scrolling', () => {
        it('should scroll to the next character when pressing right arrow', () => {
            // Arrange
            const { buttonOk, arrowDown, arrowRight } = testScreen();

            // Act
            fireEvent.click(arrowRight);
            fireEvent.click(arrowDown);
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'AAC'
                }
            });
        });

        it('should scroll to the initial character when pressing right arrow then left arrow', () => {
            // Arrange
            const { buttonOk, arrowDown, arrowRight, arrowLeft } = testScreen();

            // Act
            fireEvent.click(arrowRight);
            fireEvent.click(arrowLeft);
            fireEvent.click(arrowDown);
            fireEvent.click(buttonOk);

            // Assert
            // Wrap A to z
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'zBC'
                }
            });
        });

        it('should not scroll when pressing left arrow and already on the first character', () => {
            // Arrange
            const { buttonOk, arrowDown, arrowLeft } = testScreen();

            // Act
            fireEvent.click(arrowLeft);
            fireEvent.click(arrowDown);
            fireEvent.click(buttonOk);

            // Assert
            // Wrap A to z
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value: 'zBC'
                }
            });
        });

        it('should scroll no more than MAX_INDEX characters right', () => {
            // Arrange
            const { buttonOk, arrowUp, arrowRight } = testScreen();
            const value = setting.value + 'A'.repeat(MAX_INDEX - setting.value.length - 1) + 'C';

            // Act
            // Scroll to the current final character
            fireEvent.click(arrowRight);
            fireEvent.click(arrowRight);

            // Scroll to the MAX_INDEX character and then one more, setting each character along the way
            for (let i = setting.value.length - 1; i < MAX_INDEX + 1; i++) {
                fireEvent.click(arrowRight);
                fireEvent.click(arrowUp);
            }
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value
                }
            });
        });
    });

    describe('String length', () => {

        it('should append a new character to the current string when scrolling to a position after the current final character', () => {
            // Arrange
            const { buttonOk, arrowUp, arrowRight } = testScreen();

            // Act
            fireEvent.click(arrowRight);
            fireEvent.click(arrowRight);
            fireEvent.click(arrowRight);
            fireEvent.click(arrowUp);
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit.mock.calls[0][0].value.length).toBe(setting.value.length + 1);
        });

        it('should append a new character to the current string for every new position scrolled to after the current final character up to MAX_INDEX characters', () => {
            // Arrange
            const { buttonOk, arrowUp, arrowRight } = testScreen();
            const value = setting.value + 'A'.repeat(MAX_INDEX - setting.value.length);

            // Act
            // Scroll to the current final character
            fireEvent.click(arrowRight);
            fireEvent.click(arrowRight);

            // Scroll to the MAX_INDEX character, setting each character along the way
            for (let i = setting.value.length - 1; i < MAX_INDEX - 1; i++) {
                fireEvent.click(arrowRight);
                fireEvent.click(arrowUp);
            }
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).toHaveBeenCalledWith({
                ...setting,
                ...{
                    value
                }
            });
        });
    });

    describe('Refresh button', () => {
        it('should reset the string to the original value', () => {
            // Arrange
            const { buttonOk, arrowUp, buttonRefresh } = testScreen();

            // Act
            fireEvent.click(arrowUp);
            fireEvent.click(buttonRefresh);
            fireEvent.click(buttonOk);

            // Assert
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    })
});
