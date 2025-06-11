import type { Meta, StoryObj } from '@storybook/react';
import OptionCard from './OptionCard';

interface Option {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

const sampleOptionCard: Option = {
  id: 'sample-1',
  title: 'Premium Digital Lock',
  description: 'Electronic lock with digital code, fingerprint, and RFID card. Maximum security for your home with advanced technology.',
  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  imageType: 'rounded'
};

const meta: Meta<typeof OptionCard> = {
  title: 'Components/OptionCard',
  component: OptionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'OptionCard is a component for displaying selectable options with different image types, functional inputs, and interactive states.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    option: {
      control: 'object',
      description: 'Object containing the option information'
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the option is selected (shows filled state when true)',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    selectType: {
      control: { type: 'select', options: ['radio', 'checkbox'] },
      description: 'Input type: radio for single selection, checkbox for multiple selection',
      defaultValue: 'radio',
      table: {
        type: { summary: "'radio' | 'checkbox'" },
        defaultValue: { summary: "'radio'" }
      }
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RadioButton: Story = {
  args: {
    option: sampleOptionCard,
    isSelected: false,
    selectType: 'radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'OptionCard with radio button (single selection)'
      }
    }
  }
};

export const RadioButtonSelected: Story = {
  args: {
    option: sampleOptionCard,
    isSelected: true,
    selectType: 'radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'OptionCard with selected radio button'
      }
    }
  }
};

export const Checkbox: Story = {
  args: {
    option: sampleOptionCard,
    isSelected: false,
    selectType: 'checkbox',
  },
  parameters: {
    docs: {
      description: {
        story: 'OptionCard with checkbox (multiple selection)'
      }
    }
  }
};

export const CheckboxSelected: Story = {
  args: {
    option: sampleOptionCard,
    isSelected: true,
    selectType: 'checkbox',
  },
  parameters: {
    docs: {
      description: {
        story: 'OptionCard with selected checkbox'
      }
    }
  }
};

export const SquareImage: Story = {
  args: {
    option: {
      ...sampleOptionCard,
      id: 'option-square',
      title: 'Galvanized Steel',
      description: 'Corrosion resistant, ideal for outdoors. Durable and modern finish.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
      imageType: 'square',
    },
    isSelected: false,
    selectType: 'radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'Square image (1:1) for different types of options'
      }
    }
  }
};

export const WideImage: Story = {
  args: {
    option: {
      ...sampleOptionCard,
      id: 'reinforcement-wide',
      title: 'Anti-Drill Plate',
      description: 'Protection against drilling attempts and tool attacks. Military-grade security system.',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=280&fit=crop',
      imageType: 'wide',
    },
    isSelected: false,
    selectType: 'checkbox',
  },
  parameters: {
    docs: {
      description: {
        story: 'Wide image (16:9) for complete door views'
      }
    }
  }
};

export const InteractivePlayground: Story = {
  args: {
    option: sampleOptionCard,
    isSelected: false,
    selectType: 'radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test both filled and normal states. Use the controls to toggle `isSelected` and see the icons change between normal and filled states.'
      }
    }
  }
}; 