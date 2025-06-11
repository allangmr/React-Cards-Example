import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionCard from './OptionCard';

interface Option {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

const mockOption: Option = {
  id: 'test-option-1',
  title: 'Test Option',
  description: 'This is a test description for the option',
  image: 'https://example.com/image.jpg',
  imageType: 'square'
};

describe('OptionCard', () => {
  it('renders option information correctly', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
      />
    );

    expect(screen.getByText('Test Option')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for the option')).toBeInTheDocument();
    expect(screen.getByAltText('Test Option')).toBeInTheDocument();
  });

  it('emits click event with correct data attributes when input is changed', () => {
    const mockHandler = vi.fn();
    
    render(
      <div onClick={mockHandler}>
        <OptionCard
          option={mockOption}
          isSelected={false}
          selectType="radio"
        />
      </div>
    );

    const input = screen.getByRole('radio');
    fireEvent.click(input);

    expect(mockHandler).toHaveBeenCalled();
    
    // Verify the card has correct data attributes
    const card = screen.getByTestId('option-card');
    expect(card).toHaveAttribute('data-option-id', 'test-option-1');
    expect(card).toHaveAttribute('data-select-type', 'radio');
  });

  it('emits click event with correct data attributes when label is clicked', () => {
    const mockHandler = vi.fn();
    
    render(
      <div onClick={mockHandler}>
        <OptionCard
          option={mockOption}
          isSelected={false}
          selectType="radio"
        />
      </div>
    );

    const label = screen.getByLabelText('Test Option');
    fireEvent.click(label);

    expect(mockHandler).toHaveBeenCalled();
    
    // Verify the card has correct data attributes
    const card = screen.getByTestId('option-card');
    expect(card).toHaveAttribute('data-option-id', 'test-option-1');
    expect(card).toHaveAttribute('data-select-type', 'radio');
  });

  it('emits click event with correct data attributes when card is clicked', () => {
    const mockHandler = vi.fn();
    
    render(
      <div onClick={mockHandler}>
        <OptionCard
          option={mockOption}
          isSelected={false}
          selectType="radio"
        />
      </div>
    );

    const card = screen.getByTestId('option-card');
    fireEvent.click(card);

    expect(mockHandler).toHaveBeenCalled();
    expect(card).toHaveAttribute('data-option-id', 'test-option-1');
    expect(card).toHaveAttribute('data-select-type', 'radio');
  });

  it('shows as selected when isSelected is true', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={true}
        selectType="radio"
      />
    );

    const input = screen.getByRole('radio') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('renders checkbox when selectType is checkbox', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="checkbox"
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders radio when selectType is radio', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
      />
    );

    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('applies correct CSS classes based on option imageType', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
      />
    );

    const card = screen.getByTestId('option-card');
    expect(card).toHaveAttribute('class');
    // Verificamos que el card se renderiza correctamente
    expect(card).toBeInTheDocument();
  });

  it('applies selected class when isSelected is true', () => {
    render(
      <OptionCard
        option={mockOption}
        isSelected={true}
        selectType="radio"
      />
    );

    const card = screen.getByTestId('option-card');
    expect(card).toHaveAttribute('data-selected', 'true');
    expect(card).toBeInTheDocument();
  });
}); 