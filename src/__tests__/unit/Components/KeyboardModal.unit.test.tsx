import { setLetterRelative, replaceCharsAndTrim } from '../../../Components/KeyboardModal';

describe('setLetterRelative', () => {
    it('increments letter by 1', () => {
        // Arrange
        const str = ['A', 'B', 'C'];
        const index = 1;
        const value = 1;

        // Act
        const rtn = setLetterRelative(str, index, value);

        // Assert
        expect(rtn[index]).toBe('C');
    });

    it('decrements letter by 1', () => {
        // Arrange
        const str = ['A', 'B', 'C'];
        const index = 1;
        const value = -1;

        // Act
        const rtn = setLetterRelative(str, index, value);

        // Assert
        expect(rtn[index]).toBe('A');
    });

    it('wraps around from Z to A', () => {
        // Arrange
        const str = ['A', 'B', 'z'];
        const index = 2;
        const value = 1;

        // Act
        const rtn = setLetterRelative(str, index, value);

        // Assert
        expect(rtn[index]).toBe('A');
    });

    it('wraps around from A to Z', () => {
        // Arrange
        const str = ['A', 'B', 'C'];
        const index = 0;
        const value = -1;

        // Act
        const rtn = setLetterRelative(str, index, value);

        // Assert
        expect(rtn[index]).toBe('z');
    });
});

describe('replaceCharsAndTrim', () => {
    it('replaces non-breaking spaces with regular spaces', () => {
        // Arrange
        const str = 'Hello' + String.fromCharCode(160) + 'world';

        // Act
        const rtn = replaceCharsAndTrim(str);

        // Assert
        expect(rtn).toBe('Hello world');
    });

    it('trims leading and trailing whitespace', () => {
        // Arrange
        const str = '   Hello world   ';

        // Act
        const rtn = replaceCharsAndTrim(str);

        // Assert
        expect(rtn).toBe('Hello world');
    });

    it('replaces non-breaking spaces and trims leading and trailing whitespace', () => {
        // Arrange
        const str = '   Hello' + String.fromCharCode(160) + 'world   ';

        // Act
        const rtn = replaceCharsAndTrim(str);

        // Assert
        expect(rtn).toBe('Hello world');
    });
});
