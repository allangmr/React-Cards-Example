export type ImageType = 'rounded' | 'square' | 'wide';
export type SelectType = 'radio' | 'checkbox';

/**
 * Interface for a single option item that will be rendered as an OptionCard.
 * This corresponds to the "OptionItem" from the ticket.
 */
export interface OptionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: ImageType;
  tag?: string;
}

/**
 * Interface for the data required by the StepItem component.
 * It represents a question with a list of options.
 * This corresponds to the "Option" from the ticket.
 */
export interface StepOption {
  title: string;
  description: string;
  options: OptionItem[];
  selectType: SelectType;
} 