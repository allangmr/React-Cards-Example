import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StepItem from './StepItem';
import type { StepOption } from '../../types/Step';

// Meta information for the component
const meta: Meta<typeof StepItem> = {
  title: 'Components/StepItem',
  component: StepItem,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object', description: 'The data for the step question and options.' },
    selection: { control: 'object', description: 'The currently selected option IDs.' },
    onSelectionChange: { action: 'selectionChanged', description: 'Callback on selection change.' },
  },
};

export default meta;
type Story = StoryObj<typeof StepItem>;

// --- Mock Data ---

const accessoriesOptions: StepOption = {
  title: 'Accesorios',
  description: 'Añade accesorios adicionales para mejorar la seguridad y funcionalidad de tu puerta.',
  selectType: 'checkbox',
  options: [
    {
      id: 'acc-1',
      title: 'Mirilla Digital',
      description: 'Visualiza quién está al otro lado con una pantalla LCD.',
      image: 'https://via.placeholder.com/150/8E7AB5/FFFFFF?text=Mirilla',
      imageType: 'square',
      tag: 'Más vendido',
    },
    {
      id: 'acc-2',
      title: 'Cerrojo Adicional',
      description: 'Un nivel extra de seguridad para tu tranquilidad.',
      image: 'https://via.placeholder.com/150/3498DB/FFFFFF?text=Cerrojo',
      imageType: 'square',
    },
    {
      id: 'acc-3',
      title: 'Manija Ergonómica',
      description: 'Diseño moderno y cómodo para el uso diario.',
      image: 'https://via.placeholder.com/150/F1C40F/FFFFFF?text=Manija',
      imageType: 'square',
    },
    {
      id: 'acc-4',
      title: 'Sistema de Apertura Remota',
      description: 'Controla tu puerta desde tu smartphone.',
      image: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=Smart',
      imageType: 'square',
      tag: 'Nuevo',
    },
  ],
};

const lockTypeOptions: StepOption = {
  title: 'Tipo de Cerradura',
  description: 'Selecciona el tipo de cerradura principal para tu puerta. Solo puedes elegir una.',
  selectType: 'radio',
  options: [
    {
      id: 'lock-1',
      title: 'Cerradura Estándar',
      description: 'Seguridad básica con llave tradicional.',
      image: 'https://via.placeholder.com/150/2ECC71/FFFFFF?text=Estándar',
      imageType: 'rounded',
    },
    {
      id: 'lock-2',
      title: 'Cerradura de Alta Seguridad',
      description: 'Múltiples anclajes y protección anti-bumping.',
      image: 'https://via.placeholder.com/150/E67E22/FFFFFF?text=Seguridad',
      imageType: 'rounded',
      tag: 'Recomendado',
    },
    {
      id: 'lock-3',
      title: 'Cerradura Electrónica',
      description: 'Apertura con código, tarjeta o huella digital.',
      image: 'https://via.placeholder.com/150/9B59B6/FFFFFF?text=Electro',
      imageType: 'rounded',
    },
  ],
};

// --- Stories ---

const render = (args: any) => {
  const [selection, setSelection] = useState(args.selection);
  return <StepItem {...args} selection={selection} onSelectionChange={setSelection} />;
};

export const MultiSelect: Story = {
  args: {
    data: accessoriesOptions,
    selection: [],
  },
  render,
};

export const MultiSelectWithInitialSelection: Story = {
    args: {
      data: accessoriesOptions,
      selection: ['acc-1', 'acc-4'],
    },
    render,
  };

export const SingleSelect: Story = {
  args: {
    data: lockTypeOptions,
    selection: ['lock-2'],
  },
  render,
}; 