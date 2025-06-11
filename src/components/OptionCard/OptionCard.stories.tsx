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
      description: 'Whether the option is selected'
    },
    selectType: {
      control: { type: 'select', options: ['radio', 'checkbox'] },
      description: 'Input type: radio for single selection, checkbox for multiple selection'
    },
    onSelect: {
      action: 'selected',
      description: 'Callback function when option is selected'
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
    onSelect: (id: string) => console.log('Selected:', id),
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
    onSelect: (id: string) => console.log('Selected:', id),
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
    onSelect: (id: string) => console.log('Selected:', id),
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
    onSelect: (id: string) => console.log('Selected:', id),
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
    onSelect: (id: string) => console.log('Selected:', id),
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
    onSelect: (id: string) => console.log('Selected:', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Wide image (16:9) for complete door views'
      }
    }
  }
};

// Example of multiple cards to show interaction
export const MultipleCards: Story = {
  render: () => {
    const options: Option[] = [
      {
        id: 'lock-1',
        title: 'Digital Lock',
        description: 'With fingerprint reader',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        imageType: 'rounded'
      },
      {
        id: 'option-1',
        title: 'Stainless Steel',
        description: 'Resistant and durable',
        image: 'https://images.unsplash.com/photo-1558618047-bf5c0d516c8a?w=400&h=400&fit=crop',
        imageType: 'square'
      },
      {
        id: 'door-1',
        title: 'Complete Door',
        description: 'General product view',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=280&fit=crop',
        imageType: 'wide'
      }
    ];

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '1rem', 
        padding: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
        {options.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={false}
            selectType={index === 2 ? 'checkbox' : 'radio'}
            onSelect={(id: string) => console.log('Selected:', id)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple cards showing different image types'
      }
    }
  }
}; 