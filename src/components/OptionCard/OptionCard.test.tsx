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
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Test Option')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for the option')).toBeInTheDocument();
    expect(screen.getByAltText('Test Option')).toBeInTheDocument();
  });

  it('calls onSelect when input is changed', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('radio');
    fireEvent.click(input);

    expect(mockOnSelect).toHaveBeenCalledWith('test-option-1');
  });

  it('calls onSelect when label is clicked', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const label = screen.getByLabelText('Test Option');
    fireEvent.click(label);

    expect(mockOnSelect).toHaveBeenCalledWith('test-option-1');
  });

  it('calls onSelect when card is clicked', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByTestId('option-card');
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledWith('test-option-1');
  });

  it('shows as selected when isSelected is true', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={true}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByRole('radio') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('renders checkbox when selectType is checkbox', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="checkbox"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders radio when selectType is radio', () => {
    const mockOnSelect = vi.fn();
    
    render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('applies correct CSS classes based on option imageType', () => {
    const mockOnSelect = vi.fn();
    
    const { container } = render(
      <OptionCard
        option={mockOption}
        isSelected={false}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('.option-card');
    expect(card).toHaveClass('option-card--square');
  });

  it('applies selected class when isSelected is true', () => {
    const mockOnSelect = vi.fn();
    
    const { container } = render(
      <OptionCard
        option={mockOption}
        isSelected={true}
        selectType="radio"
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('.option-card');
    expect(card).toHaveClass('option-card--selected');
  });
}); 