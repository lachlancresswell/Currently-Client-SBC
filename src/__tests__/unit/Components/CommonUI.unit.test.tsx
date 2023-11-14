import { render, screen } from '@testing-library/react';
import { Arrow, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '../../../Components/CommonUI';

describe('arrows', () => {
  describe('Arrow', () => {
    it('renders with text', () => {
      // Arrange
      const text = 'Click me';
      render(<Arrow text={text} />);

      // Act
      const arrowElement = screen.getByText(text);

      // Assert
      expect(arrowElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      // Arrange
      const onClick = jest.fn();
      render(<Arrow onClick={onClick} text="Click me" />);

      // Act
      const arrowElement = screen.getByText('Click me');
      arrowElement.click();

      // Assert
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ArrowUp', () => {
    it('renders component', () => {
      // Arrange
      render(<ArrowUp />);

      // Act
      const arrowElement = screen.getByRole(/button/i);

      // Assert
      expect(arrowElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      // Arrange
      const onClick = jest.fn();
      render(<ArrowUp onClick={onClick} />);

      // Act
      const arrowElement = screen.getByRole(/button/);
      arrowElement.click();

      // Assert
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ArrowDown', () => {
    it('renders component', () => {
      // Arrange
      render(<ArrowDown />);

      // Act
      const arrowElement = screen.getByRole(/button/i);

      // Assert
      expect(arrowElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      // Arrange
      const onClick = jest.fn();
      render(<ArrowDown onClick={onClick} />);

      // Act
      const arrowElement = screen.getByRole(/button/);

      arrowElement.click();

      // Assert
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ArrowLeft', () => {
    it('renders component', () => {
      // Arrange
      render(<ArrowLeft />);

      // Act
      const arrowElement = screen.getByRole(/button/i);

      // Assert
      expect(arrowElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      // Arrange
      const onClick = jest.fn();
      render(<ArrowLeft onClick={onClick} />);

      // Act
      const arrowElement = screen.getByRole(/button/);

      arrowElement.click();

      // Assert
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ArrowRight', () => {
    it('renders component', () => {
      // Arrange
      render(<ArrowRight />);

      // Act
      const arrowElement = screen.getByRole(/button/i);

      // Assert
      expect(arrowElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      // Arrange
      const onClick = jest.fn();
      render(<ArrowRight onClick={onClick} />);

      // Act
      const arrowElement = screen.getByRole(/button/);

      arrowElement.click();

      // Assert
      expect(onClick).toHaveBeenCalled();
    });
  });
});
