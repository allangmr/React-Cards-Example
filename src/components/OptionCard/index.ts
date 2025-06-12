export { default } from './OptionCard';
export type { OptionCardProps } from './OptionCard';

// Export individual CSS classes for external usage
import styles from './OptionCard.module.scss';

export const optionCard = styles['option-card'];
export const optionCardSelected = styles['option-card-selected'];
export const optionCardRounded = styles['option-card-rounded'];
export const optionCardSquare = styles['option-card-square'];
export const optionCardWide = styles['option-card-wide'];
export const optionCardInput = styles['option-card-input'];
export const optionCardInputFillCurrent = styles['option-card-input-fill-current'];
export const optionCardImage = styles['option-card-image'];
export const optionCardImageRounded = styles['option-card-image-rounded'];
export const optionCardImageSquare = styles['option-card-image-square'];
export const optionCardImageWide = styles['option-card-image-wide'];
export const optionCardTitle = styles['option-card-title'];
export const optionCardDescription = styles['option-card-description'];
export const optionCardTag = styles['option-card-tag'];
export const optionCardContent = styles['option-card-content']; 